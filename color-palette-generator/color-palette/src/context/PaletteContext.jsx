import React, { createContext, useContext, useEffect, useState } from 'react';

const PaletteContext = createContext();
export const hexPattern = /^#([0-9A-Fa-f]{6})$/;

export function PaletteProvider({ children }) {
  const [colors, setColors] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  async function generatePalette(hex) {
    if (!hexPattern.test(hex)) return;
    setLoading(true);
    setApiError('');
    setColors([]);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${hex.slice(1)}&mode=analogic&count=5`,
        { signal: controller.signal }
      );
      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      if (!Array.isArray(data.colors) || data.colors.length !== 5 ||
          !data.colors.every(color => hexPattern.test(color.hex?.value))) {
        throw new Error('Invalid response');
      }
      setColors(data.colors.map(color => color.hex.value.toUpperCase()));
    } catch {
      setApiError('Could not load colors. Please check your connection and try again.');
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  useEffect(() => { generatePalette('#6875D9'); }, []);

  function savePalette(rawName) {
    const name = rawName.trim();
    if (name.length < 3 || name.length > 25) {
      return { error: 'Palette name must contain 3–25 characters.' };
    }
    if (savedPalettes.some(palette => palette.name.toLowerCase() === name.toLowerCase())) {
      return { error: 'A palette with this name already exists.' };
    }
    if (loading || colors.length === 0) {
      return { error: 'Generate a palette before saving.' };
    }
    const palette = { id: crypto.randomUUID(), name, colors: [...colors] };
    setSavedPalettes(previous => [...previous, palette]);
    return { id: palette.id };
  }

  return (
    <PaletteContext.Provider value={{ colors, savedPalettes, loading, apiError, generatePalette, savePalette }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalettes() { return useContext(PaletteContext); }
