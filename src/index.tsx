import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { createRoot } from 'react-dom/client'
import { defaultGlobalStyles } from './common/theme'
import { React as TeaReact } from 'tea-effect'
import { Effect } from 'effect'
import { init, update, view, subscriptions } from './counter'

const container = document.getElementById('root')!
const root = createRoot(container)

const Element = ({ element }: { element: TeaReact.ReactElement }) => {
  defaultGlobalStyles()
  return (
    <FluentProvider style={{ height: '100%' }} theme={webLightTheme}>
      {element}
    </FluentProvider>
  )
}

Effect.runPromise(
  TeaReact.run(TeaReact.program(init, update, view, subscriptions), element =>
    root.render(<Element element={element} />),
  ),
)
