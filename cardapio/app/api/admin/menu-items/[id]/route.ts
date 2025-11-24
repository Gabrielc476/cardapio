import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const idString = pathSegments[pathSegments.length - 1];
  
  console.log(`[PUT /api/admin/menu-items/${idString}] Handler started.`);

  try {
    const id = parseInt(idString, 10);
    console.log(`[PUT /api/admin/menu-items/${idString}] Parsed ID: ${id}`);

    if (isNaN(id)) {
      console.error(`[PUT /api/admin/menu-items/${idString}] ID is not a number.`);
      return new NextResponse('Invalid ID provided', { status: 400 });
    }

    const data = await req.json();
    console.log(`[PUT /api/admin/menu-items/${id}] Request body:`, JSON.stringify(data, null, 2));
    
    const { name, description, price, image, categoryId, addons } = data;

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price,
        image,
        categoryId,
        addons: {
          set: addons?.map((addonId: number) => ({
            id: addonId,
          })),
        },
      },
    });

    console.log(`[PUT /api/admin/menu-items/${id}] Successfully updated item with ID: ${menuItem.id}`);
    return NextResponse.json(menuItem);
  } catch (error) {
    console.error(`[PUT /api/admin/menu-items/${idString}] An error occurred:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Delete related AddonOnMenuItem records first
    await prisma.addonOnMenuItem.deleteMany({
      where: {
        menuItemId: id,
      },
    });
    
    // Then delete the menu item
    const menuItem = await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('[API Delete MenuItem] An error occurred:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
