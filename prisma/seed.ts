// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai menyuntikkan data awal (seeding)...');

  // Membuat password yang di-hash (misal password default: 'irmas123')
  const hashedPassword = await bcrypt.hash('irmas123', 10);

  // 1. Buat Akun Bendahara
  const bendahara = await prisma.user.upsert({
    where: { email: 'bendahara@irmas.com' },
    update: {},
    create: {
      name: 'Admin Bendahara',
      email: 'bendahara@irmas.com',
      password: hashedPassword,
      role: 'BENDAHARA',
    },
  });

  // 2. Buat Akun Ketua
  const ketua = await prisma.user.upsert({
    where: { email: 'ketua@irmas.com' },
    update: {},
    create: {
      name: 'Bapak Ketua',
      email: 'ketua@irmas.com',
      password: hashedPassword,
      role: 'KETUA',
    },
  });

  console.log('Seeding selesai! ✅');
  console.log({ bendahara, ketua });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });