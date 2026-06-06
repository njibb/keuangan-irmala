import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "../lib/prisma";
import NavbarUser from './components/navbaruser';

// Helper untuk format Rupiah
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const transactions = await prisma.transaction.findMany({ orderBy: { date: 'desc' } }) || [];

  const totalPemasukan = transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
  const totalPengeluaran = transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);
  const saldoSekarang = totalPemasukan - totalPengeluaran;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-white p-6 flex justify-between items-center border-b border-emerald-100 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-emerald-700">Keuangan Irmala</h1>
        {session ? (
           <NavbarUser 
             name={session.user?.name} 
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             role={(session.user as any).role} 
             initial={session.user?.name?.charAt(0)} 
           />
        ) : <Link href="/login" className="text-emerald-600 font-semibold">Login</Link>}
      </nav>
      
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Tombol hanya muncul jika sudah login */}
        {session && (
          <div className="mb-8">
            <Link href="/tambah" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm inline-block">+ Catat Transaksi</Link>
          </div>
        )}

        {/* Kartu Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Saldo Kas</p>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-700 truncate">{formatIDR(saldoSekarang)}</h3>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <p className="text-sm font-medium text-emerald-600">Pemasukan</p>
            <h3 className="text-xl md:text-2xl font-bold text-emerald-800 truncate">{formatIDR(totalPemasukan)}</h3>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
            <p className="text-sm font-medium text-red-600">Pengeluaran</p>
            <h3 className="text-xl md:text-2xl font-bold text-red-800 truncate">{formatIDR(totalPengeluaran)}</h3>
          </div>
        </div>

        {/* Tabel Responsif */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Keterangan</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {transactions.map((trx) => (
                  <tr key={trx.id}>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">{new Date(trx.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-4 text-sm font-medium max-w-[150px] truncate">{trx.description}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${trx.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {trx.type === 'IN' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-sm font-bold text-right ${trx.type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {trx.type === 'IN' ? '+' : '-'}{formatIDR(trx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}