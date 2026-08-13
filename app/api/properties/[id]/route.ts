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
    const { status, title, price, bedrooms, bathrooms, area, description, contactName, contactPhone, contactEmail, address, neighborhood } = body;

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (title !== undefined) dataToUpdate.title = title;
    if (price !== undefined) dataToUpdate.price = Number(price);
    if (bedrooms !== undefined) dataToUpdate.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) dataToUpdate.bathrooms = Number(bathrooms);
    if (area !== undefined) dataToUpdate.area = Number(area);
    if (description !== undefined) dataToUpdate.description = description;
    if (contactName !== undefined) dataToUpdate.contactName = contactName;
    if (contactPhone !== undefined) dataToUpdate.contactPhone = contactPhone;
    if (contactEmail !== undefined) dataToUpdate.contactEmail = contactEmail;
    if (address !== undefined) dataToUpdate.address = address;
    if (neighborhood !== undefined) dataToUpdate.neighborhood = neighborhood;

    const updated = await prisma.property.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Error al actualizar la vivienda' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.propertyImage.deleteMany({
      where: { propertyId: params.id },
    });

    await prisma.report.deleteMany({
      where: { propertyId: params.id },
    });

    await prisma.property.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Error al eliminar la vivienda' }, { status: 500 });
  }
}
