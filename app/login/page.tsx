'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react'; // <-- Import fungsi signIn
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Memanggil fungsi login NextAuth
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false, // Jangan redirect otomatis agar bisa kita handle manual error-nya
    });

    setIsLoading(false);

    if (res?.error) {
      setError('Email atau password salah, silakan cek kembali.');
    } else {
      // Jika berhasil, arahkan ke dashboard dan refresh halaman untuk memperbarui session
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl border border-emerald-100 shadow-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-emerald-700 tracking-tight mb-2">
            Keuangan<span className="text-emerald-400">Irmas</span>
          </h1>
          <p className="text-sm text-gray-500">Silakan masuk untuk mengelola kas operasional.</p>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
              placeholder="bendahara@irmas.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm mt-4 text-sm"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
            &larr; Kembali ke Beranda
          </a>
        </div>

      </div>
    </div>
  );
}