import { NextResponse } from 'next/server';
import { COLOMBIA_LOCATIONS } from '@/lib/locationData';

export async function GET() {
  return NextResponse.json(COLOMBIA_LOCATIONS);
}
