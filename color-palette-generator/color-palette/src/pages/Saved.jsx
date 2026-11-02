import React from 'react';
import { Link } from 'react-router-dom';
import { usePalettes } from '../context/PaletteContext';
import ColorStrip from '../components/ColorStrip';

export default function Saved() {
  const { savedPalettes } = usePalettes();
  return (
    <>
      <section className="intro"><p className="eyebrow">YOUR COLLECTION</p><h1>Saved palettes</h1><p>Open a palette to explore its colors and shades.</p></section>
      {savedPalettes.length === 0 ? (
        <section className="panel empty"><h2>No saved palettes yet</h2><p>Create your first palette to see it here.</p><Link className="button" to="/">Generate a palette</Link></section>
      ) : (
        <div className="saved-grid">{savedPalettes.map(palette => (
          <Link className="palette-card" to={`/palette/${palette.id}`} key={palette.id}>
            <ColorStrip colors={palette.colors} /><div className="card-title"><h2>{palette.name}</h2><span aria-hidden="true">↗</span></div>
          </Link>
        ))}</div>
      )}
    </>
  );
}
