import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || undefined;
    const municipality = searchParams.get('municipality') || undefined;
    const type = searchParams.get('type') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined;
    const sort = searchParams.get('sort') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'DISPONIBLE',
    };

    if (department) where.department = { equals: department, mode: 'insensitive' };
    if (municipality) where.municipality = { equals: municipality, mode: 'insensitive' };
    if (type) where.type = type;
    if (bedrooms) where.bedrooms = { gte: bedrooms };
    if (bathrooms) where.bathrooms = { gte: bathrooms };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            take: 1,
            select: { id: true, mimeType: true, base64: true, isPrimary: true },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Error al consultar viviendas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      price,
      bedrooms,
      bathrooms,
      area,
      department,
      municipality,
      neighborhood,
      address,
      latitude,
      longitude,
      contactName,
      contactPhone,
      contactEmail,
      images,
    } = body;

    if (!title || !price || !department || !municipality || !address || !contactName || !contactPhone) {
      return NextResponse.json({ error: 'Faltan campos obligatorios para publicar la vivienda' }, { status: 400 });
    }

    const newProperty = await prisma.property.create({
      data: {
        title,
        description: description || '',
        type: type || 'APARTAMENTO',
        price: parseFloat(price),
        bedrooms: bedrooms ? parseInt(bedrooms) : 1,
        bathrooms: bathrooms ? parseInt(bathrooms) : 1,
        area: area ? parseFloat(area) : 0,
        department,
        municipality,
        neighborhood: neighborhood || '',
        address,
        latitude: latitude ? parseFloat(latitude) : 4.5709,
        longitude: longitude ? parseFloat(longitude) : -74.2973,
        contactName,
        contactPhone,
        contactEmail: contactEmail || '',
        status: 'DISPONIBLE',
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

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'No se pudo publicar la vivienda' }, { status: 500 });
  }
}
