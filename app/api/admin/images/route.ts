import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetId, targetType, base64, mimeType, isPrimary } = body;

    if (!targetId || !targetType || !base64) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    if (targetType === 'PROPERTY') {
      const newImg = await prisma.propertyImage.create({
        data: {
          propertyId: targetId,
          base64,
          mimeType: mimeType || 'image/jpeg',
          isPrimary: isPrimary || false,
        },
      });
      return NextResponse.json(newImg, { status: 201 });
    } else if (targetType === 'SHELTER') {
      const newImg = await prisma.shelterImage.create({
        data: {
          shelterId: targetId,
          base64,
          mimeType: mimeType || 'image/jpeg',
          isPrimary: isPrimary || false,
        },
      });
      return NextResponse.json(newImg, { status: 201 });
    }

    return NextResponse.json({ error: 'Tipo de publicación no válido' }, { status: 400 });
  } catch (error) {
    console.error('Error al agregar imagen desde admin:', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}
