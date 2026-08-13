import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Determine if it's property image or shelter image
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'PROPERTY' or 'SHELTER'

    if (type === 'SHELTER') {
      await prisma.shelterImage.delete({
        where: { id: params.id },
      });
    } else {
      await prisma.propertyImage.delete({
        where: { id: params.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Error al eliminar la imagen' }, { status: 500 });
  }
}
