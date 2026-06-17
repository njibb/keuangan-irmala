import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Sesuaikan path prisma lu

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Transaksi dihapus!' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal hapus data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, description, type, amount, date } = await request.json();
    
    const updated = await prisma.transaction.update({
      where: { id },
      data: { 
        description, 
        type, 
        amount: Number(amount), 
        date: new Date(date) 
      },
    });
    
    return NextResponse.json({ success: true, data: updated });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal update data' }, { status: 500 });
  }
}