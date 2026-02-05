import * as Router from 'tea-effect/Router'

export const routes = Router.routes({
  home: Router.path('/'),
  about: Router.path('/about'),
})

export type Route = Router.RouteType<typeof routes>
