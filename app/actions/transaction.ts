'use server';

import { prisma } from "../../lib/prisma"; // Memakai jalur mundur agar terhindar dari error alias
import { revalidatePath } from "next/cache";

export async function simpanTransaksi(formData: FormData) {
  // 1. Ambil data dari form yang diisi pengguna
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as "IN" | "OUT";
  const category = formData.get("category") as string;
  const dateStr = formData.get("date") as string;

  // Validasi sederhana
  if (!description || !amount || !type || !category || !dateStr) {
    throw new Error("Semua kolom wajib diisi!");
  }

  // 2. Simpan data ke database melalui Prisma
  await prisma.transaction.create({
    data: {
      description,
      amount,
      type,
      category,
      date: new Date(dateStr), // Ubah format teks jadi format Tanggal (DateTime)
    },
  });

  // 3. Bersihkan cache halaman depan agar saldo dan tabel otomatis ter-update
  revalidatePath("/");
}