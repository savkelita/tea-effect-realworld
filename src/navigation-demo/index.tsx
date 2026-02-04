import { Button, Text, Card, Subtitle1, Badge, Link } from '@fluentui/react-components'
import * as Cmd from 'tea-effect/Cmd'
import * as Sub from 'tea-effect/Sub'
import * as Navigation from 'tea-effect/Navigation'
import * as Platform from 'tea-effect/Platform'
import * as TeaReact from 'tea-effect/React'

// -------------------------------------------------------------------------------------
// Model
// -------------------------------------------------------------------------------------

type Route = 'home' | 'about' | 'contact' | 'not-found'

export type Model = {
  route: Route
  location: Navigation.Location
  clickCount: number
}

export type Msg =
  | { type: 'LinkClicked'; request: Navigation.UrlRequest }
  | { type: 'UrlChanged'; location: Navigation.Location }
  | { type: 'NavigateTo'; url: string }

// -------------------------------------------------------------------------------------
// Init
// -------------------------------------------------------------------------------------

const parseRoute = (pathname: string): Route => {
  switch (pathname) {
    case '/':
    case '/home':
      return 'home'
    case '/about':
      return 'about'
    case '/contact':
      return 'contact'
    default:
      return 'not-found'
  }
}

export const init: [Model, Cmd.Cmd<Msg>] = [
  {
    route: 'home',
    location: Navigation.getLocation(),
    clickCount: 0,
  },
  Cmd.none,
]

// -------------------------------------------------------------------------------------
// Update
// -------------------------------------------------------------------------------------

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'LinkClicked':
      switch (msg.request._tag) {
        case 'Internal':
          // For internal links, use pushUrl to change URL without page reload
          return [
            { ...model, clickCount: model.clickCount + 1 },
            Navigation.pushUrl(msg.request.location.pathname + msg.request.location.search + msg.request.location.hash),
          ]
        case 'External':
          // For external links, use load to navigate away
          return [model, Navigation.load(msg.request.href)]
      }

    case 'UrlChanged':
      return [
        {
          ...model,
          route: parseRoute(msg.location.pathname),
          location: msg.location,
        },
        Cmd.none,
      ]

    case 'NavigateTo':
      return [model, Navigation.pushUrl(msg.url)]
  }
}

// -------------------------------------------------------------------------------------
// Subscriptions
// -------------------------------------------------------------------------------------

export const subscriptions = (_model: Model): Sub.Sub<Msg> =>
  Sub.batch([
    Navigation.linkClicks((request): Msg => ({ type: 'LinkClicked', request })),
    Navigation.urlChanges((location): Msg => ({ type: 'UrlChanged', location })),
  ])

// -------------------------------------------------------------------------------------
// View
// -------------------------------------------------------------------------------------

const NavLink = ({ href, children, isActive }: { href: string; children: string; isActive: boolean }) => (
  <Link
    href={href}
    style={{
      padding: '8px 16px',
      textDecoration: 'none',
      fontWeight: isActive ? 600 : 400,
      color: isActive ? '#0078d4' : '#424242',
      backgroundColor: isActive ? '#e8f4fd' : 'transparent',
      borderRadius: 6,
      border: isActive ? '1px solid #0078d4' : '1px solid transparent',
      transition: 'all 0.15s ease',
    }}
  >
    {children}
  </Link>
)

const renderPage = (route: Route): React.ReactNode => {
  switch (route) {
    case 'home':
      return (
        <Card>
          <Subtitle1>Home Page</Subtitle1>
          <Text>Welcome to the Navigation demo!</Text>
          <Text>Click the links above to navigate without page reload.</Text>
        </Card>
      )
    case 'about':
      return (
        <Card>
          <Subtitle1>About Page</Subtitle1>
          <Text>This demonstrates tea-effect Navigation module.</Text>
          <Text>
            Inspired by
            <a href="https://package.elm-lang.org/packages/elm/browser/latest/Browser-Navigation">
              Elm&apos;s Browser.Navigation
            </a>
          </Text>
        </Card>
      )
    case 'contact':
      return (
        <Card>
          <Subtitle1>Contact Page</Subtitle1>
          <Text>This is the contact page.</Text>
          <Text>
            External link example: <a href="https://github.com/savkelita/tea-effect">GitHub Repository</a>
          </Text>
        </Card>
      )
    case 'not-found':
      return (
        <Card>
          <Subtitle1>404 Not Found</Subtitle1>
          <Text>The page you&apos;re looking for doesn&apos;t exist.</Text>
        </Card>
      )
  }
}

export const view =
  (model: Model): TeaReact.Html<Msg> =>
  (dispatch: Platform.Dispatch<Msg>) =>
    (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Navigation */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <NavLink href="/home" isActive={model.route === 'home'}>
            Home
          </NavLink>
          <NavLink href="/about" isActive={model.route === 'about'}>
            About
          </NavLink>
          <NavLink href="/contact" isActive={model.route === 'contact'}>
            Contact
          </NavLink>
          <NavLink href="/unknown" isActive={model.route === 'not-found'}>
            404 Test
          </NavLink>
        </div>

        {/* Page content */}
        {renderPage(model.route)}

        {/* Debug info */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge appearance="outline">Route: {model.route}</Badge>
          <Badge appearance="outline">Path: {model.location.pathname}</Badge>
          <Badge appearance="outline">Clicks intercepted: {model.clickCount}</Badge>
        </div>

        {/* Programmatic navigation */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" onClick={() => dispatch({ type: 'NavigateTo', url: '/home' })}>
            Go Home
          </Button>
          <Button size="small" onClick={() => dispatch({ type: 'NavigateTo', url: '/about' })}>
            Go About
          </Button>
        </div>
      </div>
    )
