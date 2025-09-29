// js/data/menu.js

const menuData = {
  hamburgueres: [
    {
      id: 1,
      nome: "Cheeseburger",
      descricao: "Pão brioche, duas carnes de 90g, queijo cheddar e bacon crocante.",
      preco: 28.00,
      imagem: "../../img/cheese.png", // Imagem atualizada
      ingredientes: {
        pao: "Brioche",
        carne: [{ tipo: "Bovina", peso_g: 90, quantidade: 2 }],
        queijos: ["Cheddar"],
        outros: ["Bacon crocante"],
        molhos: []
      },
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
      imagem: "../../img/gorgon.png", // Imagem atualizada
      ingredientes: {
        pao: "Brioche",
        carne: [{ tipo: "Bovina", peso_g: 160, quantidade: 1 }],
        queijos: ["Gorgonzola cremoso"],
        outros: [],
        molhos: []
      },
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
      imagem: "../../img/batata.png" // Imagem atualizada
    }
  ],
  sobremesas: [
    {
      id: 4,
      nome: "Milkshake de Avelã",
      descricao: "Cremoso e envolvente, feito com o sabor marcante da avelã.",
      preco: 20.00,
      imagem: "../../img/avela.png" // Imagem atualizada
    },
    {
      id: 5,
      nome: "Milkshake de Pistache",
      descricao: "Refrescante e delicado, com o sabor inconfundível do pistache.",
      preco: 22.00,
      imagem: "../../img/pistache.png" // Imagem atualizada
    }
  ],
  bebidas: [
    {
      id: 6,
      nome: "Refrigerantes (Lata 350ml)",
      descricao: "Escolha entre Coca-Cola, Sprite ou Guaraná.",
      opcoes: ["Coca-Cola", "Sprite", "Guaraná"],
      preco: 6.00,
      imagem: "../../img/refri.png" // Imagem atualizada
    }
  ],
  combos: [
    {
      id: 7,
      nome: "Combo Cheeseburger Brioche",
      descricao: "Cheeseburger + fritas crocantes + refrigerante (lata 350ml).",
      preco: 42.00,
      imagem: "../../img/combo1.png", // Imagem atualizada
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
      imagem: "../../img/combo2.png", // Imagem atualizada
      adicionais: [
        { nome: "Bacon Crocante no Hambúrguer", preco: 5.00 },
        { nome: "Turbinar Fritas (Cheddar e Bacon)", preco: 8.00 }
      ]
    }
  ]
};

// Exporta a variável para que ela possa ser importada em outros arquivos
export { menuData };