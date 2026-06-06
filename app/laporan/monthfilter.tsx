'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MonthFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil bulan dari URL, kalau kosong pakai bulan ini
  const currentMonthParam = searchParams.get('month') || new Date().toISOString().slice(0, 7);
  const [year, month] = currentMonthParam.split('-');

  const handleFilter = (newYear: string, newMonth: string) => {
    // Ubah URL otomatis saat dropdown dipilih
    router.push(`/laporan?month=${newYear}-${newMonth}`);
  };

  const months = [
    { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' }, { value: '04', label: 'April' },
    { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  // Buat pilihan tahun dari 5 tahun lalu sampai tahun depan
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => (currentYear + 1 - i).toString());

  return (
    <div className="flex gap-3 mb-6">
      <select
        value={month}
        onChange={(e) => handleFilter(year, e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => handleFilter(e.target.value, month)}
        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}