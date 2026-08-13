import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || undefined;
    const municipality = searchParams.get('municipality') || undefined;
    const status = searchParams.get('status') || undefined;

    const where: any = {};
    if (department) where.department = { equals: department, mode: 'insensitive' };
    if (municipality) where.municipality = { equals: municipality, mode: 'insensitive' };
    if (status) where.status = status;

    const shelters = await prisma.shelter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          select: { id: true, mimeType: true, base64: true, isPrimary: true },
        },
      },
    });

    return NextResponse.json(shelters);
  } catch (error: any) {
    console.error('Error fetching shelters:', error);
    return NextResponse.json({ error: 'Error al consultar refugios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      department,
      municipality,
      neighborhood,
      address,
      totalCapacity,
      availableCapacity,
      services,
      phone,
      email,
      latitude,
      longitude,
      images,
    } = body;

    if (!name || !department || !municipality || !address || !phone || totalCapacity === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios para registrar el refugio' }, { status: 400 });
    }

    const newShelter = await prisma.shelter.create({
      data: {
        name,
        description: description || '',
        department,
        municipality,
        neighborhood: neighborhood || '',
        address,
        totalCapacity: parseInt(totalCapacity),
        availableCapacity: availableCapacity !== undefined ? parseInt(availableCapacity) : parseInt(totalCapacity),
        services: Array.isArray(services) ? services.join(', ') : (services || ''),
        phone,
        email: email || '',
        latitude: latitude ? parseFloat(latitude) : 4.5709,
        longitude: longitude ? parseFloat(longitude) : -74.2973,
        status: 'HABILITADO',
        images: images && images.length > 0 ? {
          create: images.map((img: any, idx: number) => ({
            mimeType: img.mimeType || 'image/jpeg',
            base64: img.base64,
            isPrimary: img.isPrimary ?? (idx === 0),
          })),
        } : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(newShelter, { status: 201 });
  } catch (error: any) {
    console.error('Error creating shelter:', error);
    return NextResponse.json({ error: 'No se pudo publicar el refugio' }, { status: 500 });
  }
}
