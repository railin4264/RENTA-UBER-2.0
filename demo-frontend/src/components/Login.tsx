import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data?.accessToken) {
        onLoginSuccess(result.data.accessToken);
        toast.success('Inicio de sesión exitoso');
      } else {
        toast.error(result.error || result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error de login:', error);
      toast.error('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-card">
            <span className="text-white text-xl font-bold">RU</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Renta Uber</h2>
          <p className="mt-1 text-sm text-gray-600">Sistema de Gestión de Vehículos</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-xl shadow-card bg-white p-6 space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Credenciales de prueba:
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Email: admin@renta-uber.com
            </p>
            <p className="text-xs text-gray-500">
              Contraseña: admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 