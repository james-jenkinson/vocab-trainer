import { Component } from 'solid-js'
import { A, Route, Routes } from '@solidjs/router'
import Home from './views/Home'
import Test from './views/Test'
import { db } from './database/db'
import CreateDeck from './views/CreateDeck'
import './App.css'

const App: Component = () => {
  const onClick = (): void => {
    db.decks.add({ name: 'Default' }).catch(console.error)
  }

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
        <A href='/test'>Test</A>
        <button class='color-mode-switcher' onClick={onColorSchemeSwitch}>{colorModeText}</button>
      </header>
      <Routes>
        <Route path='/' element={Home} />
        <Route path='/test' element={Test} />
        <Route path='/create-deck' element={CreateDeck} />
      </Routes>
      <button onClick={() => onClick()}>Create default deck</button>
    </div>
  )
}

export default App
