import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const shelter = await prisma.shelter.findUnique({
      where: { id: params.id },
      include: {
        images: true,
      },
    });

    if (!shelter) {
      return NextResponse.json({ error: 'Refugio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(shelter);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar el refugio' }, { status: 500 });
  }
}
