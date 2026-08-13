import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'authenticated_admin_colombia') {
      return NextResponse.json({ error: 'Acceso no autorizado al panel administrativo' }, { status: 401 });
    }
    const [
      totalProperties,
      totalShelters,
      totalReports,
      totalNotices,
      totalSearches,
      allProperties,
      allShelters,
      allNotices,
      allSearches,
      reports,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.shelter.count(),
      prisma.report.count(),
      prisma.streetNotice.count(),
      prisma.rentalSearch.count(),
      prisma.property.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: true },
      }),
      prisma.shelter.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: true },
      }),
      prisma.streetNotice.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.rentalSearch.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { id: true, title: true } },
          shelter: { select: { id: true, name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalProperties,
        totalShelters,
        totalReports,
        totalNotices,
        totalSearches,
      },
      properties: allProperties,
      shelters: allShelters,
      notices: allNotices,
      searches: allSearches,
      reports,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json({ error: 'Error cargando datos de administración' }, { status: 500 });
  }
}
