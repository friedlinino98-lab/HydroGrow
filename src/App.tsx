import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Navigation from './components/Navigation';
import { Header } from './components/Header';
import { useAuth } from './hooks/useAuth';

function LoginWrapper() {
  const navigate = useNavigate();
  return (
    <Login
      onNavigateRegister={() => navigate('/register')}
      onLoginSuccess={() => navigate('/')}
    />
  );
}

function RegisterWrapper() {
  const navigate = useNavigate();
  return (
    <Register
      onNavigateLogin={() => navigate('/login')}
      onRegisterSuccess={() => navigate('/')}
    />
  );
}

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--text-secondary)]">
        Lädt...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col md:flex-row">
      <Navigation />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}