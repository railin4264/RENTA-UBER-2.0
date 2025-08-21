import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './AppRoutes';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <Router>
            <a href="#main-content" className="skip-link">Saltar al contenido</a>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: { background: '#363636', color: '#fff' },
                }}
              />
              <div id="main-content">
                <AppRoutes />
              </div>
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;