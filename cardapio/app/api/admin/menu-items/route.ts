import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, description, price, image, categoryId, addons } = data;

    if (!name || !description || !price || !categoryId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        image: image || '',
        category: {
            connect: { id: categoryId }
        },
        addons: {
          create: addons?.map((addonId: number) => ({
            addon: {
              connect: { id: addonId },
            },
          })),
        },
      },
      include: {
        addons: true,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('[API Create MenuItem] An error occurred:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
