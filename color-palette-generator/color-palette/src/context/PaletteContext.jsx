import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const PaletteContext = createContext();
export const hexPattern = /^#([0-9A-Fa-f]{6})$/;

export function PaletteProvider({ children }) {
  const { user } = useAuth();
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const [savedLoading, setSavedLoading] = useState(Boolean(user));
  const [savedError, setSavedError] = useState('');
  const [reload, setReload] = useState(0);
  const reloadSaved = () => setReload(value => value + 1);
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

  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;
    setSavedLoading(true);
    setSavedError('');
    async function load() {
      try {
        const { data, error } = await supabase.from('palettes').select('id, name, colors').eq('user_id', user.id).order('created_at');
        if (error) throw error;
        if (!cancelled) setSavedPalettes(data);
      } catch {
        if (!cancelled) setSavedError('Could not load your saved palettes. Please try again.');
      } finally {
        if (!cancelled) setSavedLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id, reload]);

  async function savePalette(rawName) {
    if (!user || !supabase) return { error: 'Sign in to save a palette.' };
    if (savedLoading || savedError) return { error: 'Open Saved palettes and load your collection before saving.' };
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
    try {
      const { data: palette, error } = await supabase.from('palettes')
        .insert({ user_id: user.id, name, colors: [...colors] }).select('id, name, colors').single();
      if (error) return { error: error.code === '23505' ? 'A palette with this name already exists.' : 'Could not save your palette. Please try again.' };
      if (!active.current) return { error: 'Your session changed. Please sign in again.' };
      setSavedPalettes(previous => [...previous, palette]);
      return { id: palette.id };
    } catch {
      return { error: 'Could not save your palette. Please check your connection.' };
    }
  }

  return (
    <PaletteContext.Provider value={{ colors, savedPalettes, savedLoading, savedError, reloadSaved, loading, apiError, generatePalette, savePalette }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalettes() { return useContext(PaletteContext); }
