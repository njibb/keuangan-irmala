'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { simpanTransaksi } from '../actions/transaction';

export default function TambahTransaksi() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fungsi yang dijalankan saat tombol "Simpan" ditekan
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      
      // Panggil Server Action
      await simpanTransaksi(formData);
      
      // Jika sukses, arahkan kembali ke halaman utama (Dashboard)
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan transaksi');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 font-sans">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Catat Transaksi</h1>
            <p className="text-sm text-gray-500 mt-1">Masukkan detail pemasukan atau pengeluaran kas.</p>
          </div>
          <Link href="/" className="text-emerald-600 font-medium hover:underline text-sm">
            Batal
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Tipe Transaksi (IN / OUT) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="IN" className="peer sr-only" defaultChecked />
                  <div className="p-3 text-center rounded-xl border border-gray-200 bg-gray-50 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 font-semibold transition-all">
                    + Pemasukan
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="OUT" className="peer sr-only" />
                  <div className="p-3 text-center rounded-xl border border-gray-200 bg-gray-50 peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 font-semibold transition-all">
                    - Pengeluaran
                  </div>
                </label>
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
              <input type="date" id="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            {/* Keterangan */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
              <input type="text" id="description" name="description" required placeholder="Contoh: Beli sapu lidi, Infaq hamba Allah..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            {/* Kategori */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
              <select id="category" name="category" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="Operasional">Operasional (Kebersihan, Listrik)</option>
                <option value="Donasi">Infaq / Donasi</option>
                <option value="Kegiatan">Acara Kegiatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Nominal (Amount) */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">Nominal (Rp)</label>
              <input type="number" id="amount" name="amount" required min="1" placeholder="50000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-lg" />
            </div>

            {/* Tombol Simpan */}
            <button type="submit" disabled={isLoading} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm">
              {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}