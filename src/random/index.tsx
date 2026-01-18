import { Button, Text } from '@fluentui/react-components'
import { Effect } from 'effect'
import * as Cmd from 'tea-effect/Cmd'
import * as Sub from 'tea-effect/Sub'
import * as Platform from 'tea-effect/Platform'
import * as TeaReact from 'tea-effect/React'
import * as Task from 'tea-effect/Task'

// Custom Effect to generate random number
const randomGenerate = <Msg,>(fn: (value: number) => Msg, min = 1, max = 6): Cmd.Cmd<Msg> =>
  Task.perform(fn)(Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min))

export type Model = {
  dieFace: number
}

export type Msg = { type: 'Roll' } | { type: 'NewFace'; value: number }

// INIT
export const init: [Model, Cmd.Cmd<Msg>] = [{ dieFace: 1 }, Cmd.none]

// UPDATE
export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'Roll':
      return [model, randomGenerate(newFace => ({ type: 'NewFace', value: newFace }))]
    case 'NewFace':
      return [{ dieFace: msg.value }, Cmd.none]
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
        <Text size={800}>{model.dieFace}</Text>
        <Button onClick={() => dispatch({ type: 'Roll' })}>Roll</Button>
      </div>
    )

export const subscriptions = (_model: Model): Sub.Sub<Msg> => Sub.none
