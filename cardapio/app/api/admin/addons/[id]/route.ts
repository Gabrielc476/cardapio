import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name, price } = await req.json();

    const addon = await prisma.addon.update({
      where: { id },
      data: { name, price },
    });

    return NextResponse.json(addon);
  } catch (error) {
    console.error('[API Update Addon] An error occurred:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // First delete all connections to menu items
    await prisma.addonOnMenuItem.deleteMany({
        where: { addonId: id }
    });

    const addon = await prisma.addon.delete({
      where: { id },
    });

    return NextResponse.json(addon);
  } catch (error) {
    console.error('[API Delete Addon] An error occurred:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
