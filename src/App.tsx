import { Component } from 'solid-js'
import { A, Route, Routes } from '@solidjs/router'
import Home from './views/Home'
import CreateDeck from './views/CreateDeck'
import './App.css'
import Deck from './views/Deck'

const App: Component = () => {
  const userPrefersLightMode = window.matchMedia('(prefers-color-scheme: light)').matches
  const colorModeText = userPrefersLightMode ? 'Dark mode' : 'Light mode'

  const onColorSchemeSwitch = (): void => {
    const className = userPrefersLightMode ? 'dark-mode' : 'light-mode'
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
        <A href='/'>Home</A>
        <button class='color-mode-switcher' onClick={onColorSchemeSwitch}>{colorModeText}</button>
      </header>
      <div class="outlet">
        <Routes>
          <Route path='/' element={Home} />
          <Route path='/deck/:id' element={Deck} />
          <Route path='/create-deck' element={CreateDeck} />
        </Routes>
      </div>
    </div>
  )
}

export default App
