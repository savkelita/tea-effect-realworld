import { Option } from 'effect'
import { ScreenModel } from './screen-model'

export const selectedNavValue = (screenModel: ScreenModel): string =>
  ScreenModel.$match(screenModel, {
    HomeScreen: () => 'home',
    AboutScreen: () => 'about',
    NotFoundScreen: () => '',
    UnauthorizedScreen: () => '',
  })

export const selectedCategoryValue = (screenModel: ScreenModel): Option.Option<string> =>
  ScreenModel.$match(screenModel, {
    HomeScreen: () => Option.none(),
    AboutScreen: () => Option.none(),
    NotFoundScreen: () => Option.none(),
    UnauthorizedScreen: () => Option.none(),
  })
