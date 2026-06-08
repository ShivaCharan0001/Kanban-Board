import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

// Internal App layout that accesses useAuth
function AppContent() {
  const { user, loading } = useAuth();

  // Show a clean minimalist loading spinner during token verification
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100">
        <div className="space-y-4 text-center">
          <svg className="animate-spin h-8 w-8 text-zinc-400 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-light text-zinc-500 tracking-wider">Syncing session...</p>
        </div>
      </div>
    );
  }

  // Swap between public landing forms and protected dashboard views
  if (!user) {
    return <AuthPage />;
  }

  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
}

// Global entry point wrapping context providers
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
