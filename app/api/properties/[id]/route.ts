import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: true,
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Vivienda no encontrada' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar vivienda' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['DISPONIBLE', 'ARRENDADO', 'OCULTO', 'PENDIENTE_APROBACION'].includes(status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    const updated = await prisma.property.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating property status:', error);
    return NextResponse.json({ error: 'Error al actualizar el estado de la vivienda' }, { status: 500 });
  }
}
