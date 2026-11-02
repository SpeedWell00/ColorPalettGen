import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Account() {
  const { user, authLoading, authError, configured, signOut } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const credentials = { email: email.trim(), password };
      const result = mode === 'signup'
        ? await supabase.auth.signUp({ ...credentials, options: { emailRedirectTo: `${window.location.origin}/account` } })
        : await supabase.auth.signInWithPassword(credentials);
      if (result.error) throw result.error;
      setPassword('');
      if (mode === 'signup' && !result.data.session) {
        setMessage('Check your email to confirm your account, then sign in.');
        setMode('signin');
      }
    } catch (err) { setError(err.message || 'Could not sign in. Please try again.'); }
    finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true); setError('');
    try { await signOut(); setPassword(''); setMessage('You have signed out.'); }
    catch { setError('Could not sign out. Please try again.'); }
    finally { setBusy(false); }
  }

  if (!configured) return <section className="panel empty"><h1>Accounts are not available yet</h1><p>Please try again later.</p><Link to="/">Back to generator</Link></section>;
  if (authLoading) return <p role="status">Checking your session…</p>;
  return <section className="panel account-panel">
    <p className="eyebrow">YOUR ACCOUNT</p>
    <h1>{user ? 'Your account' : mode === 'signup' ? 'Create an account' : 'Sign in'}</h1>
    {authError && <p className="error" role="alert">{authError}</p>}
    {user ? <><p className="account-email">{user.email}</p><p>Your palettes are saved to your account.</p><div className="form-row"><Link className="button" to="/saved">Saved palettes</Link><button className="secondary" disabled={busy} onClick={logout}>Sign out</button></div></> : <>
      <form onSubmit={submit}>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={mode === 'signup' ? 8 : undefined} required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} />
        {mode === 'signup' && <p className="hint">Use at least 8 characters.</p>}
        <button disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
      </form>
      <button className="secondary" disabled={busy} onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setMessage(''); setPassword(''); }}>{mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
    </>}
    {error && <p className="error" role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
  </section>;
}
