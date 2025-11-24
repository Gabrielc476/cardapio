import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface Adicional {
  nome: string;
  preco: number;
}

interface MenuItem {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  adicionais?: Adicional[];
}

interface MenuData {
  [key: string]: MenuItem[];
}

const menuData: MenuData = {
  hamburgueres: [
    {
      id: 1,
      nome: "Cheeseburger",
      descricao: "Pão brioche, duas carnes de 90g, queijo cheddar e bacon crocante.",
      preco: 28.00,
      imagem: "/img/cheese.png",
      adicionais: [
        { nome: "Carne Extra (90g)", preco: 8.00 },
        { nome: "Queijo Cheddar Extra", preco: 4.00 },
        { nome: "Bacon Extra", preco: 5.00 },
        { nome: "Cebola Caramelizada", preco: 3.00 }
      ]
    },
    {
      id: 2,
      nome: "Gorgon",
      descricao: "Pão brioche, hambúrguer de 160g e queijo gorgonzola cremoso.",
      preco: 30.00,
      imagem: "/img/gorgon.png",
      adicionais: [
        { nome: "Carne Extra (160g)", preco: 10.00 },
        { nome: "Queijo Gorgonzola Extra", preco: 6.00 },
        { nome: "Bacon Crocante", preco: 5.00 }
      ]
    }
  ],
  acompanhamentos: [
    {
      id: 3,
      nome: "Fritas",
      descricao: "Batatas douradas por fora e macias por dentro, servidas sequinhas.",
      preco: 13.00,
      imagem: "/img/batata.png"
    }
  ],
  sobremesas: [
    {
      id: 4,
      nome: "Milkshake de Avelã",
      descricao: "Cremoso e envolvente, feito com o sabor marcante da avelã.",
      preco: 20.00,
      imagem: "/img/avela.png"
    },
    {
      id: 5,
      nome: "Milkshake de Pistache",
      descricao: "Refrescante e delicado, com o sabor inconfundível do pistache.",
      preco: 22.00,
      imagem: "/img/pistache.png"
    }
  ],
  bebidas: [
    {
      id: 6,
      nome: "Refrigerantes (Lata 350ml)",
      descricao: "Escolha entre Coca-Cola, Sprite ou Guaraná.",
      preco: 6.00,
      imagem: "/img/refri.png"
    }
  ],
  combos: [
    {
      id: 7,
      nome: "Combo Cheeseburger Brioche",
      descricao: "Cheeseburger + fritas crocantes + refrigerante (lata 350ml).",
      preco: 42.00,
      imagem: "/img/combo1.png",
      adicionais: [
        { nome: "Bacon Extra no Hambúrguer", preco: 5.00 },
        { nome: "Cheddar Extra no Hambúrguer", preco: 4.00 },
        { nome: "Turbinar Fritas (Cheddar e Bacon)", preco: 8.00 }
      ]
    },
    {
      id: 8,
      nome: "Combo Gorgon",
      descricao: "Hambúrguer Gorgon + fritas crocantes + refrigerante (lata 350ml).",
      preco: 44.00,
      imagem: "/img/combo2.png",
      adicionais: [
        { nome: "Bacon Crocante no Hambúrguer", preco: 5.00 },
        { nome: "Turbinar Fritas (Cheddar e Bacon)", preco: 8.00 }
      ]
    }
  ]
};

async function main() {
  console.log(`Start seeding ...`);

  // Create unique addons
  const allAddons = Object.values(menuData).flat().flatMap(item => item.adicionais || []);
  const uniqueAddons = Array.from(new Map(allAddons.map(item => [item.nome, item])).values());

  for (const addon of uniqueAddons) {
    await prisma.addon.upsert({
      where: { name: addon.nome },
      update: {},
      create: {
        name: addon.nome,
        price: addon.preco,
      },
    });
  }

  // Create categories and menu items
  for (const [categoryName, items] of Object.entries(menuData)) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    for (const item of items) {
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.nome,
          description: item.descricao,
          price: item.preco,
          image: item.imagem,
          categoryId: category.id,
        },
      });

      if (item.adicionais) {
        for (const ad of item.adicionais) {
          const addonRecord = await prisma.addon.findUnique({ where: { name: ad.nome } });
          if (addonRecord) {
            await prisma.addonOnMenuItem.create({
              data: {
                menuItemId: menuItem.id,
                addonId: addonRecord.id,
              },
            });
          }
        }
      }
    }
  }
  console.log(`Seeding finished.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
