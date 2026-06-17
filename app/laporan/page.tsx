import { prisma } from "../../lib/prisma";
import ExportButton from "./exportbutton";
import MonthFilter from "./monthfilter";
import Link from "next/link";
import NavbarUser from "./../components/navbaruser";
import { getServerSession } from "next-auth"; // <-- TAMBAHIN INI
import { authOptions } from "../api/auth/[...nextauth]/route"; // <-- TAMBAHIN INI (Sesuaikan path jika beda)
import ActionTransaksi from "./components/actiontransaksi"; // <-- PANGGIL KOMPONEN TOMBOL

export default async function LaporanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const session = await getServerSession(authOptions); // Cek siapa yang lagi buka
  const params = await searchParams;
  const selectedMonth = params.month || new Date().toISOString().slice(0, 7);

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: new Date(`${selectedMonth}-01T00:00:00Z`),
        lt: new Date(new Date(selectedMonth).setMonth(new Date(selectedMonth).getMonth() + 1)),
      },
    },
    orderBy: { date: 'desc' }, // Lebih enak dibaca kalau yang terbaru di atas
  });

  const [year, month] = selectedMonth.split('-');
  const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const displayMonth = `${monthNames[parseInt(month)]} ${year}`;
  const hasTransactions = transactions.length > 0;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Header Navigasi */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm mb-8 z-50 relative">
        <Link href="/" className="text-xl font-bold text-emerald-700 hover:opacity-80 transition-opacity">
          Keuangan Irmala
        </Link>
        {session ? (
          <NavbarUser 
            name={session.user?.name} 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            role={(session.user as any).role} 
            initial={session.user?.name?.charAt(0)} 
          />
        ) : (
          <Link href="/login" className="text-emerald-600 font-semibold">Login</Link>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Dashboard Utama
        </Link>

        <h1 className="text-2xl font-black mb-6 text-emerald-900">Laporan Bulanan</h1>

        <MonthFilter />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Data Transaksi {displayMonth}</h2>
          
          {hasTransactions && (
            <ExportButton data={transactions} fileName={`LPJ_${selectedMonth}.xlsx`} />
          )}
        </div>

        {hasTransactions ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Keterangan</th>
                    <th className="p-4 text-right">Masuk</th>
                    <th className="p-4 text-right">Keluar</th>
                    {/* Header AKSI hanya muncul kalau udah login */}
                    {session && <th className="p-4 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-600">{t.date.toLocaleDateString('id-ID')}</td>
                      <td className="p-4 font-medium text-gray-900">{t.description}</td>
                      <td className="p-4 text-right text-emerald-600 font-black">{t.type === 'IN' ? `+ Rp ${t.amount.toLocaleString('id-ID')}` : '-'}</td>
                      <td className="p-4 text-right text-red-600 font-black">{t.type === 'OUT' ? `- Rp ${t.amount.toLocaleString('id-ID')}` : '-'}</td>
                      
                      {/* Kolom AKSI hanya muncul kalau udah login */}
                      {session && (
                        <td className="p-4 text-right">
                          <ActionTransaksi transaksi={t} />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
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