import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePalettes } from '../context/PaletteContext';

export default function AccountGate({ children }) {
  const { user, authLoading, authError, configured } = useAuth();
  const { savedLoading, savedError, reloadSaved } = usePalettes();
  if (!configured) return <section className="panel empty"><h1>Account storage is not available yet</h1><p>Please try again later.</p></section>;
  if (authLoading) return <p role="status">Checking your session…</p>;
  if (authError) return <p className="error" role="alert">{authError}</p>;
  if (!user) return <section className="panel empty"><h1>Sign in to view your palettes</h1><p>Your saved palettes are private to your account.</p><Link className="button" to="/account">Sign in</Link></section>;
  if (savedLoading) return <p role="status">Loading saved palettes…</p>;
  if (savedError) return <section className="panel"><p className="error" role="alert">{savedError}</p><button onClick={reloadSaved}>Try again</button></section>;
  return children;
}
