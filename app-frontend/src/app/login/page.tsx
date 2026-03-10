'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4 font-sans">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-[#1e1e1e] border border-[#333] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4ade80] opacity-5 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#4ade80] opacity-5 blur-[100px]" />

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-[#2a2a2a] rounded-2xl flex items-center justify-center mb-4 border border-[#444] shadow-lg">
              <ShieldCheck className="w-8 h-8 text-[#4ade80]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Private Access</h1>
            <p className="text-gray-400 text-center">Enter your security password to manage your expenses.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4ade80] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#4ade80]/50 focus:border-[#4ade80] transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-[#121212] font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#4ade80]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Access Application'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 relative z-10">
            Authorized personal access only.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
