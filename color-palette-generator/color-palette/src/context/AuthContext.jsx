import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        setAuthError('Could not restore your session. Please reload and try again.');
        setAuthLoading(false);
      }
    }, 20000);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      clearTimeout(timer);
      setSession(nextSession);
      setAuthError('');
      setAuthLoading(false);
    });
    return () => { active = false; clearTimeout(timer); subscription.unsubscribe(); };
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
    setSession(null);
  }

  return <AuthContext.Provider value={{ user: session?.user ?? null, authLoading, authError, signOut, configured: Boolean(supabase) }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
