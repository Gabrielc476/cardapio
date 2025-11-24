'use client';

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemCard, MenuItem } from "./menu-item-card";
import { ItemModal } from "./item-modal";

type MenuData = {
  hamburgueres: MenuItem[];
  acompanhamentos: MenuItem[];
  sobremesas: MenuItem[];
  bebidas: MenuItem[];
  combos: MenuItem[];
};

const categoryNames: { [key in keyof MenuData]: string } = {
  hamburgueres: "Hambúrgueres",
  combos: "Combos",
  acompanhamentos: "Acompanhamentos",
  bebidas: "Bebidas",
  sobremesas: "Sobremesas",
};

export function Menu() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) {
          console.error('[Menu] Failed to fetch menu data, response not ok.');
          const errorText = await res.text();
          console.error('[Menu] Error response text:', errorText);
          return;
        }
        const data = await res.json();
        setMenuData(data);
      } catch (error) {
        console.error('[Menu] An error occurred while fetching menu data:', error);
      }
    }
    fetchData();
  }, []);

  if (!menuData) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <section className="container mx-auto py-8">
        <Tabs defaultValue="hamburgueres">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {(Object.keys(menuData) as Array<keyof MenuData>).map((category) => (
              <TabsTrigger key={category} value={category}>
                {categoryNames[category]}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(menuData) as Array<keyof MenuData>).map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menuData[category].map((item) => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
      <ItemModal 
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
