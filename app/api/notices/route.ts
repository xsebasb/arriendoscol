import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;

    const where: any = {};
    if (status) where.status = status;

    const notices = await prisma.streetNotice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar avisos de la calle' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { municipality, neighborhood, description, mimeType, base64 } = body;

    if (!municipality || !base64) {
      return NextResponse.json({ error: 'Falta la imagen o la ciudad del aviso' }, { status: 400 });
    }

    const newNotice = await prisma.streetNotice.create({
      data: {
        municipality,
        neighborhood: neighborhood || '',
        description: description || '',
        mimeType: mimeType || 'image/jpeg',
        base64,
        status: 'PENDIENTE',
      },
    });

    return NextResponse.json(newNotice, { status: 201 });
  } catch (error: any) {
    console.error('Error enviando aviso de calle:', error);
    return NextResponse.json({ error: error?.message || 'No se pudo subir el aviso de calle' }, { status: 500 });
  }
}
