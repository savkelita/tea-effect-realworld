# tea-effect-realworld

Real-world examples demonstrating [tea-effect](https://github.com/savkelita/tea-effect).

## Examples

| Example | Description |
|---------|-------------|
| Counter | Basic TEA pattern with Model, Msg, update, view |
| PersistentCounter | Counter with localStorage persistence using `LocalStorage` module |
| Random | Random number generation using `Task.perform` with Effect's Random |
| Users | HTTP requests with Schema validation and error handling |
| Timer | Subscriptions with `Sub.interval` |
| Navigation | SPA routing with `Navigation` module (linkClicks, urlChanges, pushUrl) |

## Installation

```sh
yarn install
```

## Development

```sh
yarn start
```

Open https://localhost:3000

## Build

```sh
yarn build
```

## License

MIT
