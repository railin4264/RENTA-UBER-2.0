import React, { useEffect, useState } from 'react';

export default function StatusPage() {
  const [status, setStatus] = useState<'idle'|'ok'|'error'>('idle');
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const ping = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${api}/health`);
        const data = await res.json();
        if (res.ok) { setStatus('ok'); setInfo(data); }
        else { setStatus('error'); setError(data?.error || res.statusText); }
      } catch (e: any) {
        setStatus('error');
        setError(e?.message || 'Network error');
      }
    };
    ping();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-2">Estado del Backend</h1>
        <p className="text-gray-600 mb-4">Ping a /api/health</p>
        {status === 'idle' && <p>Verificando...</p>}
        {status === 'ok' && (
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">OK</p>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(info, null, 2)}</pre>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-2">
            <p className="text-red-600 font-semibold">Error</p>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}