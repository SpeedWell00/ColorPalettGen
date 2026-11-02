import React from 'react';
import { NavLink, Routes, Route, Link } from 'react-router-dom';
import Generator from './pages/Generator';
import Saved from './pages/Saved';
import PaletteDetail from './pages/PaletteDetail';

export default function App() {
  return (
    <>
      <header className="header">
        <Link to="/" className="brand"><span className="brand-icon" aria-hidden="true" />Color Palette</Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Generate</NavLink>
          <NavLink to="/saved">Saved palettes</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/palette/:id" element={<PaletteDetail />} />
          <Route path="*" element={<section><h1>Page not found</h1><Link to="/">Back to generator</Link></section>} />
        </Routes>
      </main>
      <footer>Color Palette Generator <span>Colors from TheColorAPI</span></footer>
    </>
  );
}
