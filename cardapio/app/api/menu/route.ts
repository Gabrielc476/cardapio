import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Manually define types to match the expected data structure from Prisma
interface Addon {
    nome: string;
    preco: number;
}

interface MenuItem {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
    adicionais?: Addon[];
}

interface CategoryWithItems {
    id: number;
    name: string;
    items: {
        id: number;
        name: string;
        description: string;
        price: number;
        image: string;
        addons: {
            addon: {
                name: string;
                price: number;
            };
        }[];
    }[];
}

type MenuData = {
    [key: string]: MenuItem[];
};


export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        items: {
          include: {
            addons: {
              include: {
                addon: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match the old structure
    const menuData = categories.reduce((acc: MenuData, category: CategoryWithItems) => {
      const categoryName = category.name;
      
      const items: MenuItem[] = category.items.map(item => {
        const addons = item.addons.map(addonOnItem => ({
            nome: addonOnItem.addon.name,
            preco: addonOnItem.addon.price,
        }));

        return {
            id: item.id,
            nome: item.name,
            descricao: item.description,
            preco: item.price,
            imagem: item.image,
            adicionais: addons.length > 0 ? addons : undefined,
        };
      });

      acc[categoryName] = items;
      return acc;
    }, {});

    return NextResponse.json(menuData);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
