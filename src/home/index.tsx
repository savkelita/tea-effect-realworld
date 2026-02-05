import { Title1, Text, Card, CardHeader } from '@fluentui/react-components'
import * as Cmd from 'tea-effect/Cmd'
import type * as Platform from 'tea-effect/Platform'
import type * as TeaReact from 'tea-effect/React'
import type { Model } from './model'
import type { Msg } from './msg'

export type { Model }
export type { Msg }

export const init: [Model, Cmd.Cmd<Msg>] = [{}, Cmd.none]

export const update = (_msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => [model, Cmd.none]

export const view =
  (_model: Model): TeaReact.Html<Msg> =>
  (_dispatch: Platform.Dispatch<Msg>) =>
    (
      <Card>
        <CardHeader header={<Title1>Home</Title1>} />
        <Text>Welcome to the tea-effect SPA example.</Text>
        <Text>
          This app uses <strong>Navigation.program</strong> and <strong>Router</strong> for type-safe client-side
          routing.
        </Text>
      </Card>
    )
