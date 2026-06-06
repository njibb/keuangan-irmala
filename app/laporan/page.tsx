import { prisma } from "../../lib/prisma";
import ExportButton from "./exportbutton";
import MonthFilter from "./monthfilter";
import Link from "next/link";

// 1. Ubah tipe parameter searchParams menjadi Promise
export default async function LaporanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  
  // 2. Tambahkan await di sini supaya Next.js 15 bisa membaca URL-nya
  const params = await searchParams;
  const selectedMonth = params.month || new Date().toISOString().slice(0, 7);

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: new Date(`${selectedMonth}-01T00:00:00Z`),
        lt: new Date(new Date(selectedMonth).setMonth(new Date(selectedMonth).getMonth() + 1)),
      },
    },
    orderBy: { date: 'asc' },
  });

  // Bikin nama bulan jadi format bahasa Indonesia untuk judul
  const [year, month] = selectedMonth.split('-');
  const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const displayMonth = `${monthNames[parseInt(month)]} ${year}`;

  // Cek apakah ada transaksi di bulan tersebut
  const hasTransactions = transactions.length > 0;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Tombol Kembali ke Dashboard */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Halaman Utama
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-gray-900">Laporan Bulanan</h1>

        {/* Dropdown Filter Bulan & Tahun */}
        <MonthFilter />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Data Transaksi {displayMonth}</h2>
          
          {/* Tombol Download HANYA muncul kalau ada data */}
          {hasTransactions && (
            <ExportButton data={transactions} fileName={`LPJ_${selectedMonth}.xlsx`} />
          )}
        </div>

        {/* Kondisi: Tampilkan Tabel ATAU Pesan Kosong */}
        {hasTransactions ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Keterangan</th>
                  <th className="p-4 text-right">Masuk</th>
                  <th className="p-4 text-right">Keluar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{t.date.toLocaleDateString('id-ID')}</td>
                    <td className="p-4 font-medium text-gray-900">{t.description}</td>
                    <td className="p-4 text-right text-emerald-600 font-semibold">{t.type === 'IN' ? t.amount.toLocaleString('id-ID') : '-'}</td>
                    <td className="p-4 text-right text-red-600 font-semibold">{t.type === 'OUT' ? t.amount.toLocaleString('id-ID') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
            {/* Ikon Kosong */}
            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="text-base font-semibold text-gray-900">Tidak ada transaksi</h3>
            <p className="mt-1 text-sm text-gray-500">Belum ada pemasukan atau pengeluaran yang tercatat pada {displayMonth}.</p>
          </div>
        )}

      </div>
    </main>
  );
}