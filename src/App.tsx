import { Component, createSignal } from 'solid-js'
import { A, Route, Routes } from '@solidjs/router'
import Home from './views/Home'
import CreateDeck from './views/CreateDeck'
import DeckView from './views/DeckView'
import AddWord from './views/AddWord'
import Settings from './views/Settings'
import './App.css'
import StudyDeck from './views/StudyDeck'

const App: Component = () => {
  const userPrefersLightMode = window.matchMedia('(prefers-color-scheme: light)').matches
  const [prefersLightMode, setPrefersLightMode] = createSignal(userPrefersLightMode)

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (value) => {
    document.documentElement.removeAttribute('class')
    setPrefersLightMode(value.matches)
  })

  const onColorSchemeSwitch = (): void => {
    const className = prefersLightMode() ? 'dark-mode' : 'light-mode'
    const classAlreadyPresent = document.documentElement.classList.contains(className)

    if (classAlreadyPresent) {
      document.documentElement.classList.remove(className)
    } else {
      document.documentElement.classList.add(className)
    }
  }

  return (
    <div>
      <header>
        <nav>
          <A href='/'>Home</A>
          <A href='/settings'>Settings</A>
        </nav>
        <button class='color-mode-switcher' onClick={onColorSchemeSwitch}>
          {prefersLightMode() ? 'Dark mode' : 'Light mode'}
        </button>
      </header>
      <div class="outlet">
        <Routes>
          <Route path='/' element={Home} />
          <Route path='/settings' element={Settings} />
          <Route path='/deck/:id' element={DeckView} />
          <Route path='/deck/:id/add-word' element={AddWord} />
          <Route path='/deck/:id/study' element={StudyDeck} />
          <Route path='/create-deck' element={CreateDeck} />
        </Routes>
      </div>
    </div>
  )
}

export default App
