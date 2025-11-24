import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, price } = await req.json();

    if (!name || price === undefined) {
      return new NextResponse('Missing name or price', { status: 400 });
    }

    const addon = await prisma.addon.create({
      data: { name, price },
    });

    return NextResponse.json(addon);
  } catch (error) {
    console.error('[API Create Addon] An error occurred:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
