import {
  Button,
  Spinner,
  Card,
  CardHeader,
  Avatar,
  Caption1,
  Text,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components'
import { MailRegular, ArrowClockwiseRegular } from '@fluentui/react-icons'
import { Schema, Option, pipe } from 'effect'
import * as Cmd from 'tea-effect/Cmd'
import * as Http from 'tea-effect/Http'
import * as Sub from 'tea-effect/Sub'
import * as Platform from 'tea-effect/Platform'
import * as TeaReact from 'tea-effect/React'

const User = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String,
})

type User = Schema.Schema.Type<typeof User>

const getUsers = Http.get('/users', Http.expectJson(Schema.Array(User)))

export type Model = {
  users: readonly User[]
  loading: boolean
  error: Option.Option<Http.HttpError>
}

export type Msg =
  | { type: 'FetchUsers' }
  | { type: 'UsersLoaded'; users: readonly User[] }
  | { type: 'UsersFailed'; error: Http.HttpError }

const fetchUsersCmd = Http.send(getUsers, {
  onSuccess: (users): Msg => ({ type: 'UsersLoaded', users }),
  onError: (error): Msg => ({ type: 'UsersFailed', error }),
})

const renderError = (error: Http.HttpError): string => {
  switch (error._tag) {
    case 'BadUrl':
      return `Invalid URL: ${error.url}`
    case 'Timeout':
      return 'Request timed out'
    case 'NetworkError':
      return 'Network error - check your connection'
    case 'BadStatus':
      return `Server error: ${error.status}`
    case 'BadBody':
      return `Invalid response: ${error.error}`
  }
}

const renderErrorMessage = (error: Option.Option<Http.HttpError>) =>
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

export const init: [Model, Cmd.Cmd<Msg>] = [{ users: [], loading: true, error: Option.none() }, fetchUsersCmd]

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'FetchUsers':
      return [{ ...model, loading: true, error: Option.none() }, fetchUsersCmd]
    case 'UsersLoaded':
      return [{ ...model, loading: false, users: msg.users }, Cmd.none]
    case 'UsersFailed':
      return [{ ...model, loading: false, error: Option.some(msg.error) }, Cmd.none]
  }
}

export const view =
  (model: Model): TeaReact.Html<Msg> =>
  (dispatch: Platform.Dispatch<Msg>) =>
    (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Caption1>{model.users.length} users loaded</Caption1>
          <Button
            icon={<ArrowClockwiseRegular />}
            onClick={() => dispatch({ type: 'FetchUsers' })}
            disabled={model.loading}
          >
            {model.loading ? 'Loading...' : 'Reload'}
          </Button>
        </div>

        {model.loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spinner label="Loading users..." />
          </div>
        )}

        {renderErrorMessage(model.error)}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {model.users.map(user => (
            <Card key={user.id} size="small">
              <CardHeader
                image={<Avatar name={user.name} color="colorful" />}
                header={<Text weight="semibold">{user.name}</Text>}
                description={
                  <Caption1 style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MailRegular fontSize={12} />
                    {user.email}
                  </Caption1>
                }
              />
            </Card>
          ))}
        </div>
      </div>
    )

export const subscriptions = (_model: Model): Sub.Sub<Msg> => Sub.none
