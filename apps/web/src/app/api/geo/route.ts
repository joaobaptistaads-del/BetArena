import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    country: null,
    currency: null,
    locale: null,
  });
}
