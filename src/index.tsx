/* @refresh reload */
import { render } from 'solid-js/web'

import './index.scss'
import App from './App'
import { Router } from '@solidjs/router'

render(
  () => (
    <Router base={import.meta.env.BASE_URL}>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
)
