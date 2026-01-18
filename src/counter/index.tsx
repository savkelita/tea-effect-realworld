import { Button, Text } from '@fluentui/react-components'
import * as Cmd from 'tea-effect/Cmd'
import * as Sub from 'tea-effect/Sub'
import * as Platform from 'tea-effect/Platform'
import * as TeaReact from 'tea-effect/React'

export type Model = {
  count: number
}

export type Msg = { type: 'Increment' } | { type: 'Decrement' } | { type: 'Reset' }

// INIT
export const init: [Model, Cmd.Cmd<Msg>] = [{ count: 0 }, Cmd.none]

// UPDATE
export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'Increment':
      return [{ count: model.count + 1 }, Cmd.none]
    case 'Decrement':
      return [{ count: model.count - 1 }, Cmd.none]
    case 'Reset':
      return [{ count: 0 }, Cmd.none]
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
        <Text size={800}>{model.count}</Text>
        <Button onClick={() => dispatch({ type: 'Increment' })}>Increment</Button>
        <Button onClick={() => dispatch({ type: 'Decrement' })}>Decrement</Button>
        <Button onClick={() => dispatch({ type: 'Reset' })}>Reset</Button>
      </div>
    )

export const subscriptions = (_model: Model): Sub.Sub<Msg> => Sub.none
