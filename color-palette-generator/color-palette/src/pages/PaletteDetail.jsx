import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePalettes } from '../context/PaletteContext';
import ColorStrip from '../components/ColorStrip';

function mixColor(hex, target, amount) {
  const channels = [1, 3, 5].map(start => {
    const channel = parseInt(hex.slice(start, start + 2), 16);
    return Math.round(channel + (target - channel) * amount).toString(16).padStart(2, '0');
  });
  return `#${channels.join('').toUpperCase()}`;
}

export default function PaletteDetail() {
  const { id } = useParams();
  const { savedPalettes } = usePalettes();
  const palette = savedPalettes.find(item => item.id === id);

  if (!palette) return <section className="panel empty"><h1>Palette not found</h1><p>This palette is not available in your account.</p><Link to="/saved">Back to saved palettes</Link></section>;

  return (
    <>
      <section className="intro"><Link className="back-link" to="/saved">← Saved palettes</Link><p className="eyebrow">PALETTE DETAILS</p><h1>{palette.name}</h1><p>Your palette and its light-to-dark variations.</p></section>
      <section className="panel"><h2>Palette colors</h2><ColorStrip colors={palette.colors} /></section>
      <section className="shades-section"><h2>Shades &amp; tints</h2><p className="hint">40% lighter · 20% lighter · Original · 20% darker · 40% darker</p>
        {palette.colors.map((color, index) => <div className="shade-row" key={`${color}-${index}`}><h3>{color}</h3><ColorStrip colors={[mixColor(color, 255, 0.4), mixColor(color, 255, 0.2), color, mixColor(color, 0, 0.2), mixColor(color, 0, 0.4)]} /></div>)}
      </section>
    </>
  );
}
