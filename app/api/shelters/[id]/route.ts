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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, department, municipality, address, phone, email, description, availableCapacity, totalCapacity } = body;

    const updatedShelter = await prisma.shelter.update({
      where: { id: params.id },
      data: {
        name,
        department,
        municipality,
        address,
        phone,
        email,
        description,
        availableCapacity: Number(availableCapacity),
        totalCapacity: Number(totalCapacity),
      },
    });

    return NextResponse.json(updatedShelter);
  } catch (error) {
    console.error('Error actualizando refugio:', error);
    return NextResponse.json({ error: 'Error al actualizar refugio' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.shelterImage.deleteMany({
      where: { shelterId: params.id },
    });

    await prisma.report.deleteMany({
      where: { shelterId: params.id },
    });

    await prisma.shelter.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando refugio:', error);
    return NextResponse.json({ error: 'Error al eliminar refugio' }, { status: 500 });
  }
}
