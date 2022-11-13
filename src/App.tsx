import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { A, Route, Routes } from '@solidjs/router';
import Home from './views/Home';
import Test from './views/Test';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
        <A href='/'>Home</A>
        <A href='/test'>Test</A>
      </header>
      <Routes>
        <Route path='/' element={Home} />
        <Route path='/test' element={Test} />
      </Routes>
      test
    </div>
  );
};

export default App;
