import React from 'react';
import { NavLink, Routes, Route, Link } from 'react-router-dom';
import Generator from './pages/Generator';
import Saved from './pages/Saved';
import PaletteDetail from './pages/PaletteDetail';

import Account from './pages/Account';
import AccountGate from './components/AccountGate';

export default function App() {
  return (
    <>
      <header className="header">
        <Link to="/" className="brand"><span className="brand-icon" aria-hidden="true" />Color Palette</Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Generate</NavLink>
          <NavLink to="/saved">Saved palettes</NavLink>
          <NavLink to="/account">Account</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/saved" element={<AccountGate><Saved /></AccountGate>} />
          <Route path="/palette/:id" element={<AccountGate><PaletteDetail /></AccountGate>} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<section><h1>Page not found</h1><Link to="/">Back to generator</Link></section>} />
        </Routes>
      </main>
      <footer>Color Palette Generator <span>Colors from TheColorAPI</span></footer>
    </>
  );
}
