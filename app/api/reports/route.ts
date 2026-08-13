import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reason, details, propertyId, shelterId } = body;

    if (!reason || (!propertyId && !shelterId)) {
      return NextResponse.json({ error: 'Faltan datos obligatorios para el reporte' }, { status: 400 });
    }

    const newReport = await prisma.report.create({
      data: {
        reason,
        details: details || '',
        propertyId: propertyId || undefined,
        shelterId: shelterId || undefined,
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar reporte' }, { status: 500 });
  }
}
