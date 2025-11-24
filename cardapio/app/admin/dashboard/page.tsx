import { prisma } from '@/lib/prisma';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  // Fetch all data on the server
  const menuItems = await prisma.menuItem.findMany({
    include: { 
        category: true,
        addons: {
            select: {
                addonId: true
            }
        }
    },
    orderBy: { id: 'asc' },
  });
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' },
  });
  const addons = await prisma.addon.findMany({
    orderBy: { id: 'asc' },
  });

  return (
    <DashboardClient
      initialMenuItems={menuItems}
      initialCategories={categories}
      initialAddons={addons}
    />
  );
}