// js/data/menu.js

const menuData = {
  hamburgueres: [
    {
      id: 1,
      nome: "Cheeseburger",
      descricao: "Pão brioche, duas carnes de 90g, queijo cheddar e bacon crocante.",
      preco: 28.00,
      imagem: "https://placehold.co/600x400/2c2c2c/ff9900?text=Cheeseburger",
      ingredientes: {
        pao: "Brioche",
        carne: [{ tipo: "Bovina", peso_g: 90, quantidade: 2 }],
        queijos: ["Cheddar"],
        outros: ["Bacon crocante"],
        molhos: []
      }
    },
    {
      id: 2,
      nome: "Gorgon",
      descricao: "Pão brioche, hambúrguer de 160g e queijo gorgonzola cremoso.",
      preco: 30.00,
      imagem: "https://placehold.co/600x400/2c2c2c/ff9900?text=Gorgon",
      ingredientes: {
        pao: "Brioche",
        carne: [{ tipo: "Bovina", peso_g: 160, quantidade: 1 }],
        queijos: ["Gorgonzola cremoso"],
        outros: [],
        molhos: []
      }
    }
  ],
  acompanhamentos: [
    {
      id: 3,
      nome: "Fritas",
      descricao: "Batatas douradas por fora e macias por dentro, servidas sequinhas.",
      preco: 13.00,
      imagem: "https://placehold.co/600x400/2c2c2c/ff9900?text=Fritas"
    }
  ],
  sobremesas: [
    {
      id: 4,
      nome: "Milkshake de Avelã",
      descricao: "Cremoso e envolvente, feito com o sabor marcante da avelã.",
      preco: 20.00,
      imagem: "https://placehold.co/600x400/2c2c2c/ff9900?text=Milkshake+Avelã"
    },
    {
      id: 5,
      nome: "Milkshake de Pistache",
      descricao: "Refrescante e delicado, com o sabor inconfundível do pistache.",
      preco: 22.00,
      imagem: "https://placehold.co/600x400/2c2c2c/ff9900?text=Milkshake+Pistache"
    }
  ],
  bebidas: [
    {
      id: 6,
      nome: "Refrigerantes (Lata 350ml)",
      descricao: "Escolha entre Coca-Cola, Sprite ou Guaraná.", // Descrição adicionada
      opcoes: ["Coca-Cola", "Sprite", "Guaraná"],
      preco: 6.00,
      imagem: "https://placehold.co/600x400/2c2c2c/ff9900?text=Refrigerantes"
    }
  ],
  combos: [
    {
      id: 7,
      nome: "Combo Cheeseburger Brioche",
      descricao: "Cheeseburger + fritas crocantes + refrigerante (lata 350ml).",
      preco: 42.00,
      imagem: "https://placehold.co/600x400/2c2c2c/ff9900?text=Combo+Cheeseburger"
    },
    {
      id: 8,
      nome: "Combo Gorgon",
      descricao: "Hambúrguer Gorgon + fritas crocantes + refrigerante (lata 350ml).",
      preco: 44.00,
      imagem: "https://placehold.co/600x400/2c2c2c/ff9900?text=Combo+Gorgon"
    }
  ]
};

// Exporta a variável para que ela possa ser importada em outros arquivos
export { menuData };