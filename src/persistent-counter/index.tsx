import { Button, Text, MessageBar, MessageBarBody } from '@fluentui/react-components'
import { Schema, Option, pipe } from 'effect'
import * as Cmd from 'tea-effect/Cmd'
import * as Sub from 'tea-effect/Sub'
import * as Platform from 'tea-effect/Platform'
import * as TeaReact from 'tea-effect/React'
import * as LocalStorage from 'tea-effect/LocalStorage'

// SCHEMA
const Counter = Schema.Struct({
  count: Schema.Number,
})

type Counter = Schema.Schema.Type<typeof Counter>

const STORAGE_KEY = 'tea-persistent-counter'

// MODEL
export type Model = {
  count: number
  loaded: boolean
  error: Option.Option<LocalStorage.LocalStorageError>
}

// MSG
export type Msg =
  | { type: 'Increment' }
  | { type: 'Decrement' }
  | { type: 'Reset' }
  | { type: 'Loaded'; data: Option.Option<Counter> }
  | { type: 'SyncedFromOtherTab'; data: Option.Option<Counter> }
  | { type: 'Saved' }
  | { type: 'StorageError'; error: LocalStorage.LocalStorageError }

// ERROR HELPERS
const renderError = (error: LocalStorage.LocalStorageError): string => {
  switch (error._tag) {
    case 'StorageNotAvailable':
      return 'LocalStorage is not available'
    case 'QuotaExceeded':
      return 'Storage quota exceeded'
    case 'JsonParseError':
      return 'Failed to parse stored data'
    case 'DecodeError':
      return 'Stored data has invalid format'
    case 'EncodeError':
      return 'Failed to encode data for storage'
  }
}

const renderErrorMessage = (error: Option.Option<LocalStorage.LocalStorageError>) =>
  pipe(
    error,
    Option.match({
      onNone: () => null,
      onSome: e => (
        <MessageBar intent="error">
          <MessageBarBody>{renderError(e)}</MessageBarBody>
        </MessageBar>
      ),
    }),
  )

// COMMANDS
const saveCounter = (count: number): Cmd.Cmd<Msg> =>
  LocalStorage.set(
    STORAGE_KEY,
    Counter,
    { count },
    {
      onSuccess: (): Msg => ({ type: 'Saved' }),
      onError: (error): Msg => ({ type: 'StorageError', error }),
    },
  )

// INIT
export const init: [Model, Cmd.Cmd<Msg>] = [
  { count: 0, loaded: false, error: Option.none() },
  LocalStorage.get(STORAGE_KEY, Counter, {
    onSuccess: (data): Msg => ({ type: 'Loaded', data }),
    onError: (error): Msg => ({ type: 'StorageError', error }),
  }),
]

// UPDATE
export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'Loaded': {
      const count = pipe(
        msg.data,
        Option.match({
          onNone: () => 0,
          onSome: d => d.count,
        }),
      )
      return [{ ...model, count, loaded: true }, Cmd.none]
    }

    case 'SyncedFromOtherTab': {
      const count = pipe(
        msg.data,
        Option.match({
          onNone: () => 0,
          onSome: d => d.count,
        }),
      )
      return [{ ...model, count }, Cmd.none]
    }

    case 'StorageError':
      return [{ ...model, loaded: true, error: Option.some(msg.error) }, Cmd.none]

    case 'Saved':
      return [{ ...model, error: Option.none() }, Cmd.none]

    case 'Increment': {
      const newCount = model.count + 1
      return [{ ...model, count: newCount }, saveCounter(newCount)]
    }

    case 'Decrement': {
      const newCount = model.count - 1
      return [{ ...model, count: newCount }, saveCounter(newCount)]
    }

    case 'Reset':
      return [{ ...model, count: 0 }, saveCounter(0)]
  }
}

// VIEW
export const view =
  (model: Model): TeaReact.Html<Msg> =>
  (dispatch: Platform.Dispatch<Msg>) =>
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: 200,
        }}
      >
        {!model.loaded ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {renderErrorMessage(model.error)}
            <Text size={800}>{model.count}</Text>
            <Button onClick={() => dispatch({ type: 'Increment' })}>Increment</Button>
            <Button onClick={() => dispatch({ type: 'Decrement' })}>Decrement</Button>
            <Button onClick={() => dispatch({ type: 'Reset' })}>Reset</Button>
            <Text size={200} style={{ color: 'gray' }}>
              Open in another tab to test sync!
            </Text>
          </>
        )}
      </div>
    )

// SUBSCRIPTIONS - sync across tabs
export const subscriptions = (_model: Model): Sub.Sub<Msg> =>
  LocalStorage.onChange(STORAGE_KEY, Counter, {
    onSuccess: (data): Msg => ({ type: 'SyncedFromOtherTab', data }),
    onError: (error): Msg => ({ type: 'StorageError', error }),
  })
