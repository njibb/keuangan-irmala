'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ActionTransaksi({ transaksi }: { transaksi: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk form edit
  const [desc, setDesc] = useState(transaksi.description);
  const [amount, setAmount] = useState(transaksi.amount);
  const [type, setType] = useState(transaksi.type);
  const [date, setDate] = useState(new Date(transaksi.date).toISOString().split('T')[0]);

  const handleDelete = async () => {
    if (!window.confirm('Yakin mau hapus transaksi ini bre?')) return;
    
    try {
      const res = await fetch('/api/transaksi', { 
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json', // <-- INI PENTING BIAR SERVER NGERTI
        },
        body: JSON.stringify({ id: transaksi.id }) 
      });

      if (res.ok) {
        router.refresh(); // Langsung update UI kalau sukses
      } else {
        alert('Gagal hapus transaksi. Coba cek console!');
      }
    } catch (error) {
      console.error(error);
      alert('Error jaringan pas hapus data.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/transaksi', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // <-- INI JUGA PENTING
        },
        body: JSON.stringify({ id: transaksi.id, description: desc, amount, type, date }),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh(); // Langsung update UI kalau sukses
      } else {
        alert('Gagal update transaksi!');
      }
    } catch (error) {
      console.error(error);
      alert('Error jaringan pas update data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-3 justify-end items-center">
        <button onClick={() => setIsOpen(true)} className="text-amber-500 hover:text-amber-700 text-xs font-bold transition-colors">
          Edit
        </button>
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors">
          Hapus
        </button>
      </div>

      {/* MODAL EDIT */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black text-emerald-800 mb-4">Edit Transaksi</h3>
            
            <form onSubmit={handleUpdate} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal</label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Keterangan</label>
                <input type="text" required value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipe</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none font-bold">
                    <option value="IN">Pemasukan</option>
                    <option value="OUT">Pengeluaran</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nominal (Rp)</label>
                  <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none" />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  {isLoading ? 'Menyimpan...' : 'Simpan Edit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}