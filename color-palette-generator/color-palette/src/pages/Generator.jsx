import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePalettes, hexPattern } from '../context/PaletteContext';
import ColorStrip from '../components/ColorStrip';

export default function Generator() {
  const { colors, loading, apiError, generatePalette, savePalette } = usePalettes();
  const [hex, setHex] = useState('#6875D9');
  const [name, setName] = useState('');
  const [hexError, setHexError] = useState('');
  const [nameError, setNameError] = useState('');
  const navigate = useNavigate();

  function handleGenerate(event) {
    event.preventDefault();
    if (!hexPattern.test(hex)) {
      setHexError('Enter # followed by exactly 6 hexadecimal characters, for example #6875D9.');
      return;
    }
    setHexError('');
    setNameError('');
    generatePalette(hex);
  }

  function handleSave(event) {
    event.preventDefault();
    const result = savePalette(name);
    if (result.error) setNameError(result.error);
    else navigate(`/palette/${result.id}`);
  }

  return (
    <>
      <section className="intro"><p className="eyebrow">COLOR PALETTE GENERATOR</p><h1>A starting color.<br />A palette of possibilities.</h1><p>Enter a hex color to create a matching five-color palette.</p></section>
      <section className="panel">
        <form onSubmit={handleGenerate} noValidate>
          <label htmlFor="hex">Base color</label>
          <div className="form-row"><input id="hex" value={hex} onChange={event => { setHex(event.target.value); setHexError(''); }} placeholder="#6875D9" spellCheck="false" aria-invalid={Boolean(hexError)} aria-describedby="hex-error" /><button disabled={loading}>{loading ? 'Generating…' : 'Generate palette'}</button></div>
          <p id="hex-error" className="error" role="alert">{hexError}</p>
        </form>
        <div aria-live="polite" aria-busy={loading}>
          {loading && <div className="placeholder">Loading your colors…</div>}
          {apiError && <p className="error api-error" role="alert">{apiError}</p>}
          {!loading && colors.length > 0 && <ColorStrip colors={colors} />}
        </div>
        <form className="save-form" onSubmit={handleSave} noValidate>
          <label htmlFor="name">Palette name</label>
          <div className="form-row"><input id="name" value={name} onChange={event => { setName(event.target.value); setNameError(''); }} placeholder="Give your palette a name" aria-invalid={Boolean(nameError)} aria-describedby="name-hint name-error" /><button className="secondary" disabled={loading || colors.length === 0}>Save palette</button></div>
          <p id="name-hint" className="hint">3–25 characters. Each saved palette must have a unique name.</p>
          <p id="name-error" className="error" role="alert">{nameError}</p>
        </form>
      </section>
    </>
  );
}
