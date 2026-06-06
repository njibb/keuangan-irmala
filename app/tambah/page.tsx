'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { simpanTransaksi } from '../actions/transaction';
import NavbarUser from './../components/navbaruser'; // Pastikan path ini benar!

export default function TambahTransaksi() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tipe, setTipe] = useState('IN');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [keterangan, setKeterangan] = useState('');
  const [nominal, setNominal] = useState('');
  const [kategori, setKategori] = useState('Operasional');

  const handleScanNota = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/scan-nota', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (data.amount) setNominal(data.amount.toString());
        if (data.merchant) setKeterangan(`Belanja di ${data.merchant}`);
        if (data.date) setTanggal(data.date);
        
        setTipe('OUT');
        alert("✅ Berhasil membaca nota! Silakan cek kembali datanya sebelum disimpan.");
      } else {
        setError(`Gagal membaca nota: ${data.error || 'Coba gunakan foto yang lebih jelas.'}`);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Terjadi kesalahan jaringan saat memproses nota.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      await simpanTransaksi(formData);
      router.push('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan transaksi');
      setIsLoading(false);
    }
  };

  return (
    // PENTING: Padding 'p-6' dihapus dari div utama agar Header bisa menyentuh ujung layar
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* ============================== */}
      {/* HEADER NAVIGASI GLOBAL         */}
      {/* ============================== */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm mb-8 z-50 relative">
        <Link href="/" className="text-xl font-bold text-emerald-700 hover:opacity-80 transition-opacity">
          Keuangan Irmala
        </Link>
        {/* Sesuaikan name, role, dan initial dengan data session kamu jika ada */}
        <NavbarUser name="Admin Bendahara" role="BENDAHARA" initial="A" />
      </div>

      {/* Konten Form */}
      <div className="max-w-xl mx-auto px-6 pb-12">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
          href="/" 
          className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Halaman Utama
        </Link>
          </div>
        </div>

        <div className="mb-6">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef}
            onChange={handleScanNota} 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 border-dashed rounded-xl p-4 font-semibold hover:bg-emerald-100 transition disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>AI sedang menganalisis nota...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>📸 Scan Nota Pengeluaran (Otomatis Isi)</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="IN" checked={tipe === 'IN'} onChange={() => setTipe('IN')} className="peer sr-only" />
                  <div className="p-3 text-center rounded-xl border border-gray-200 bg-gray-50 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 font-semibold transition-all">
                    + Pemasukan
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" value="OUT" checked={tipe === 'OUT'} onChange={() => setTipe('OUT')} className="peer sr-only" />
                  <div className="p-3 text-center rounded-xl border border-gray-200 bg-gray-50 peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 font-semibold transition-all">
                    - Pengeluaran
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
              <input type="date" id="date" name="date" required value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
              <input type="text" id="description" name="description" required value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Contoh: Beli sapu lidi, Infaq hamba Allah..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
              <select id="category" name="category" required value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="Operasional">Operasional (Kebersihan, Listrik)</option>
                <option value="Donasi">Infaq / Donasi</option>
                <option value="Kegiatan">Acara Kegiatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">Nominal (Rp)</label>
              <input type="number" id="amount" name="amount" required min="1" value={nominal} onChange={(e) => setNominal(e.target.value)} placeholder="50000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-lg" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm">
              {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}