import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const municipality = searchParams.get('municipality') || undefined;
    const type = searchParams.get('type') || undefined;

    const where: any = {};
    if (municipality) where.municipality = { equals: municipality, mode: 'insensitive' };
    if (type) where.type = type;

    const searches = await prisma.rentalSearch.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(searches);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar búsquedas de arriendo' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      municipality,
      type,
      neighborhood,
      stratum,
      bedroomsNeeded,
      budget,
      needsParking,
      description,
      contactName,
      contactPhone,
    } = body;

    if (!title || !municipality || !budget || !contactName || !contactPhone) {
      return NextResponse.json({ error: 'Faltan campos obligatorios para publicar tu búsqueda' }, { status: 400 });
    }

    const newSearch = await prisma.rentalSearch.create({
      data: {
        title,
        municipality,
        type: type || 'APARTAMENTO',
        neighborhood: neighborhood || '',
        stratum: stratum || '',
        bedroomsNeeded: bedroomsNeeded ? parseInt(bedroomsNeeded) : 1,
        budget: parseFloat(budget),
        needsParking: Boolean(needsParking),
        description: description || '',
        contactName,
        contactPhone,
      },
    });

    return NextResponse.json(newSearch, { status: 201 });
  } catch (error) {
    console.error('Error creando búsqueda de arriendo:', error);
    return NextResponse.json({ error: 'No se pudo registrar tu solicitud de búsqueda' }, { status: 500 });
  }
}
