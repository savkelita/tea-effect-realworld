import { Data } from 'effect'
import type * as Home from '../home'
import type * as About from '../about'

export type ScreenModel = Data.TaggedEnum<{
  HomeScreen: { readonly model: Home.Model }
  AboutScreen: { readonly model: About.Model }
  NotFoundScreen: { readonly path: string }
  UnauthorizedScreen: { readonly path: string }
}>

export const ScreenModel = Data.taggedEnum<ScreenModel>()

export const homeScreen = (model: Home.Model): ScreenModel => ScreenModel.HomeScreen({ model })

export const aboutScreen = (model: About.Model): ScreenModel => ScreenModel.AboutScreen({ model })

export const notFoundScreen = (path: string): ScreenModel => ScreenModel.NotFoundScreen({ path })

export const unauthorizedScreen = (path: string): ScreenModel => ScreenModel.UnauthorizedScreen({ path })
