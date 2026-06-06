/* eslint-disable prefer-const */
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Tangkap file gambar dari form frontend
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    // 2. Bungkus ulang file-nya untuk dikirim ke Mindee
    const mindeeFormData = new FormData();
    mindeeFormData.append('document', file);

    // 3. Tembak API Mindee (Model Receipt/Struk)
    const response = await fetch('https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.MINDEE_API_KEY}`
      },
      body: mindeeFormData
    });

    if (!response.ok) {
      throw new Error('Gagal menghubungi Mindee API');
    }

    const result = await response.json();
    
    // 4. Ekstrak hasil bacaan AI-nya
    const prediction = result.document.inference.prediction;
    
    // Ambil nominal, nama toko (merchant), dan tanggal
    const amount = prediction.total_amount?.value || 0;
    const merchant = prediction.supplier_name?.value || 'Toko tidak terbaca';
    let date = prediction.date?.value || '';

    // Kembalikan ke frontend dalam bentuk JSON yang rapi
    return NextResponse.json({ amount, merchant, date });

  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: 'Gagal memproses nota' }, { status: 500 });
  }
}