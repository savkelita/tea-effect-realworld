import { Data } from 'effect'
import type * as Home from '../home'
import type * as About from '../about'

export type ScreenMsg = Data.TaggedEnum<{
  HomeMsg: { readonly msg: Home.Msg }
  AboutMsg: { readonly msg: About.Msg }
}>

export const ScreenMsg = Data.taggedEnum<ScreenMsg>()

export const homeMsg = (msg: Home.Msg): ScreenMsg => ScreenMsg.HomeMsg({ msg })

export const aboutMsg = (msg: About.Msg): ScreenMsg => ScreenMsg.AboutMsg({ msg })
