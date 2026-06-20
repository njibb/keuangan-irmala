import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; 
import NavbarUser from './components/navbaruser';
import MonthFilter from './laporan/monthfilter';

// Helper untuk format Rupiah
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const session = await getServerSession(authOptions);
  
  // 1. TANGKAP PARAMETER BULAN DARI URL
  const params = await searchParams;
  const selectedMonth = params.month || new Date().toISOString().slice(0, 7);

  // 2. AMBIL TRANSAKSI KHUSUS BULAN INI (Buat Tabel & Pemasukan/Pengeluaran)
  const monthlyTransactions = await prisma.transaction.findMany({ 
    where: {
      date: {
        gte: new Date(`${selectedMonth}-01T00:00:00Z`),
        lt: new Date(new Date(selectedMonth).setMonth(new Date(selectedMonth).getMonth() + 1)),
      },
    },
    orderBy: { date: 'desc' } 
  }) || [];

  // 3. HITUNG PEMASUKAN & PENGELUARAN BULAN INI
  const pemasukanBulanIni = monthlyTransactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
  const pengeluaranBulanIni = monthlyTransactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);

  // 4. HITUNG SALDO KESELURUHAN (Dari Awal Sampai Sekarang)
  const allTransactions = await prisma.transaction.findMany({ select: { type: true, amount: true }});
  const saldoSekarang = allTransactions.reduce((acc, t) => acc + (t.type === 'IN' ? t.amount : -t.amount), 0);

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
        
        {/* Header Aksi & Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {session ? (
            <Link href="/tambah" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm inline-block">
              + Catat Transaksi
            </Link>
          ) : (
            <div></div> /* Spacer kalau blm login */
          )}
          
          {/* PANGGIL KOMPONEN FILTER BULAN DI SINI */}
          <MonthFilter />
        </div>

        {/* Kartu Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <p className="text-sm font-medium text-gray-500">Total Saldo Kas (Keseluruhan)</p>
            <h3 className="text-2xl md:text-3xl font-black text-emerald-700 truncate mt-1">{formatIDR(saldoSekarang)}</h3>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <p className="text-sm font-medium text-emerald-600">Pemasukan Bulan Ini</p>
            <h3 className="text-xl md:text-2xl font-bold text-emerald-800 truncate mt-1">{formatIDR(pemasukanBulanIni)}</h3>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
            <p className="text-sm font-medium text-red-600">Pengeluaran Bulan Ini</p>
            <h3 className="text-xl md:text-2xl font-bold text-red-800 truncate mt-1">{formatIDR(pengeluaranBulanIni)}</h3>
          </div>
        </div>

        {/* Tabel Responsif */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-100">
            <h2 className="text-sm font-bold text-emerald-800">
              Riwayat Transaksi: <span className="text-emerald-600">{new Date(`${selectedMonth}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
            </h2>
          </div>
          
          {monthlyTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3">Tipe</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {monthlyTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-600">{new Date(trx.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-800">{trx.description}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${trx.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {trx.type === 'IN' ? 'Masuk' : 'Keluar'}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-sm font-black text-right ${trx.type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trx.type === 'IN' ? '+' : '-'}{formatIDR(trx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-400 font-medium">Belum ada transaksi di bulan ini bre.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}