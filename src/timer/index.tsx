import { Button, Text } from '@fluentui/react-components'
import * as Cmd from 'tea-effect/Cmd'
import * as Sub from 'tea-effect/Sub'
import * as Platform from 'tea-effect/Platform'
import * as TeaReact from 'tea-effect/React'

export type Model = {
  seconds: number
  running: boolean
}

export type Msg = { type: 'Tick' } | { type: 'Toggle' } | { type: 'Reset' }

export const init: [Model, Cmd.Cmd<Msg>] = [{ seconds: 0, running: false }, Cmd.none]

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'Tick':
      return [{ ...model, seconds: model.seconds + 1 }, Cmd.none]
    case 'Toggle':
      return [{ ...model, running: !model.running }, Cmd.none]
    case 'Reset':
      return [{ ...model, seconds: 0 }, Cmd.none]
  }
}

export const subscriptions = (model: Model): Sub.Sub<Msg> =>
  model.running ? Sub.interval(1000, { type: 'Tick' }) : Sub.none

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
        <Text size={800}>{model.seconds}s</Text>
        <Button onClick={() => dispatch({ type: 'Toggle' })}>{model.running ? 'Stop' : 'Start'}</Button>
        <Button onClick={() => dispatch({ type: 'Reset' })}>Reset</Button>
      </div>
    )
