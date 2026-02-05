import type { ScreenModel } from './screen-model'
import type * as Nav from '../navigation'

export type Model = {
  readonly screen: ScreenModel
  readonly navigation: Nav.Model
}
