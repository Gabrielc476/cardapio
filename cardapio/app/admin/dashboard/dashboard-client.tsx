'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MenuItemForm } from '@/components/menu-item-form';
import { CategoryForm } from '@/components/category-form';
import { AddonForm } from '@/components/addon-form';

// Define types to avoid passing complex generics from server
type MenuItem = { id: number; name: string; price: number; description: string; image: string; categoryId: number; category: { name: string }; addons: { addonId: number }[]; };
type Category = { id: number; name: string };
type Addon = { id: number; name: string; price: number };

interface DashboardClientProps {
  initialMenuItems: any[];
  initialCategories: Category[];
  initialAddons: Addon[];
}

export default function DashboardClient({
  initialMenuItems,
  initialCategories,
  initialAddons,
}: DashboardClientProps) {
  const router = useRouter();

  // Unified state for forms and dialogs
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    mode: '' as 'create-item' | 'edit-item' | 'create-category' | 'edit-category' | 'create-addon' | 'edit-addon' | '',
    data: null as any,
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    type: '' as 'item' | 'category' | 'addon' | '',
    data: null as any,
  });

  // API Call Abstraction
  const handleApiCall = async (url: string, method: string, body?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Failed to ${method}`);
      router.refresh();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Form Submission
  const handleFormSubmit = async (values: any) => {
    let url = '';
    let method = '';
    switch (dialogState.mode) {
      case 'create-item':
        url = '/api/admin/menu-items';
        method = 'POST';
        break;
      case 'edit-item':
        url = `/api/admin/menu-items/${dialogState.data.id}`;
        method = 'PUT';
        break;
      case 'create-category':
        url = '/api/admin/categories';
        method = 'POST';
        break;
      case 'edit-category':
        url = `/api/admin/categories/${dialogState.data.id}`;
        method = 'PUT';
        break;
      case 'create-addon':
        url = '/api/admin/addons';
        method = 'POST';
        break;
      case 'edit-addon':
        url = `/api/admin/addons/${dialogState.data.id}`;
        method = 'PUT';
        break;
    }
    const success = await handleApiCall(url, method, values);
    if (success) setDialogState({ isOpen: false, mode: '', data: null });
  };
  
  // Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteState.data) return;
    let url = '';
    switch (deleteState.type) {
      case 'item':
        url = `/api/admin/menu-items/${deleteState.data.id}`;
        break;
      case 'category':
        url = `/api/admin/categories/${deleteState.data.id}`;
        break;
      case 'addon':
        url = `/api/admin/addons/${deleteState.data.id}`;
        break;
    }
    await handleApiCall(url, 'DELETE');
    setDeleteState({ isOpen: false, type: '', data: null });
  };

  const openFormDialog = (mode: typeof dialogState.mode, data: any = null) => {
    setDialogState({ isOpen: true, mode, data });
  }

  const openDeleteDialog = (type: typeof deleteState.type, data: any) => {
    setDeleteState({ isOpen: true, type, data });
  }

  const renderForm = () => {
    switch (dialogState.mode) {
      case 'create-item':
      case 'edit-item':
        const initialItemData = dialogState.data ? { ...dialogState.data, price: Number(dialogState.data.price), addons: dialogState.data.addons.map((a:any) => a.addonId) } : undefined;
        return <MenuItemForm onSubmit={handleFormSubmit} categories={initialCategories} addons={initialAddons} initialData={initialItemData} />;
      case 'create-category':
      case 'edit-category':
        return <CategoryForm onSubmit={handleFormSubmit} initialData={dialogState.data} />;
      case 'create-addon':
      case 'edit-addon':
        return <AddonForm onSubmit={handleFormSubmit} initialData={dialogState.data} />;
      default:
        return null;
    }
  }

  const getDialogTitle = () => {
    if (dialogState.mode.includes('item')) return dialogState.data ? 'Edit Item' : 'Create New Item';
    if (dialogState.mode.includes('category')) return dialogState.data ? 'Edit Category' : 'Create New Category';
    if (dialogState.mode.includes('addon')) return dialogState.data ? 'Edit Add-on' : 'Create New Add-on';
    return '';
  }

  return (
    <>
      <div className="space-y-12">
        {/* Menu Items Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Menu Items</h2>
            <Button onClick={() => openFormDialog('create-item')}>Create New Item</Button>
          </div>
          <Table>
             <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialMenuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category.name}</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openFormDialog('edit-item', item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog('item', item)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Categories Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Categories</h2>
            <Button onClick={() => openFormDialog('create-category')}>Create New Category</Button>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {initialCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openFormDialog('edit-category', cat)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog('category', cat)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Addons Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Add-ons</h2>
            <Button onClick={() => openFormDialog('create-addon')}>Create New Add-on</Button>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Price</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {initialAddons.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell>{addon.name}</TableCell>
                  <TableCell>{addon.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openFormDialog('edit-addon', addon)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog('addon', addon)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Generic Delete Confirmation Dialog */}
      <AlertDialog open={deleteState.isOpen} onOpenChange={(isOpen) => setDeleteState({ ...deleteState, isOpen })}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the {deleteState.type}
                <span className="font-bold"> {deleteState.data?.name}</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Generic Create/Edit Dialog */}
      <Dialog open={dialogState.isOpen} onOpenChange={(isOpen) => setDialogState({ ...dialogState, isOpen })}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{getDialogTitle()}</DialogTitle>
            </DialogHeader>
            {renderForm()}
        </DialogContent>
      </Dialog>
    </>
  );
}


