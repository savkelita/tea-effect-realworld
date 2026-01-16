import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { createRoot } from 'react-dom/client'
import { defaultGlobalStyles } from './common/theme'
import * as TeaReact from 'tea-effect/React'
import { Effect } from 'effect'
import { init, update, view, subscriptions } from './app'

const container = document.getElementById('root')!
const root = createRoot(container)

const Element = ({ dom }: { dom: TeaReact.Dom }) => {
  defaultGlobalStyles()
  return (
    <FluentProvider style={{ height: '100%' }} theme={webLightTheme}>
      {dom}
    </FluentProvider>
  )
}

Effect.runPromise(
  TeaReact.run(TeaReact.program(init, update, view, subscriptions), dom => root.render(<Element dom={dom} />)),
)
