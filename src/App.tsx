import type { Component } from 'solid-js';
import { A, Route, Routes } from '@solidjs/router';
import Home from './views/Home';
import Test from './views/Test';

const App: Component = () => {
  return (
    <div>
      <header>
        <A href='/'>Home</A>
        <A href='/test'>Test</A>
      </header>
      <Routes>
        <Route path='/' element={Home} />
        <Route path='/test' element={Test} />
      </Routes>
    </div>
  );
};

export default App;
