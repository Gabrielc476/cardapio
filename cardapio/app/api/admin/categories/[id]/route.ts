import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name } = await req.json();

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[API Update Category] An error occurred:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Note: This will fail if there are any menu items still associated with this category.
    // A more robust implementation would re-assign items or prevent deletion.
    const category = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[API Delete Category] An error occurred:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
