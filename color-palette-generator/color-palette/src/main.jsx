import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PaletteProvider } from './context/PaletteContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import App from './App';
import './index.css';

function SessionPalettes() {
  const { user } = useAuth();
  return <PaletteProvider key={user?.id ?? 'guest'}><App /></PaletteProvider>;
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider><SessionPalettes /></AuthProvider>
  </BrowserRouter>
);
