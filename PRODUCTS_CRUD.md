# Plan: Product Management (CRUD)

This document outlines the plan for implementing a product management feature, allowing administrators to perform CRUD (Create, Read, Update, Delete) operations on menu items.

## 1. Objective

To provide a secure dashboard for users with the `ADMIN` role to manage all aspects of the menu, including categories, menu items, and add-ons.

## 2. Core Features

*   View all existing categories, menu items, and add-ons.
*   Create new categories, menu items, and add-ons.
*   Update existing items.
*   Delete items.

## 3. Implementation Plan

### Step 1: Role-Based Authorization

1.  **Middleware Update:** The `middleware.ts` file will be enhanced to check for the user's role.
    *   It will decode the JWT to access the `role` payload.
    *   It will protect specific routes (e.g., `/admin/*`) so they are only accessible to users where `role === 'ADMIN'`.
    *   Users without the `ADMIN` role trying to access these routes will be redirected or shown a "Permission Denied" page.

### Step 2: Backend API Routes

New API endpoints will be created to handle the CRUD operations. These routes will be protected by the middleware.

*   **/api/admin/menu-items**
    *   `POST`: Create a new menu item.
*   **/api/admin/menu-items/[id]**
    *   `PUT`: Update a menu item by its ID.
    *   `DELETE`: Delete a menu item by its ID.

*   **(Similar routes will be created for `/api/admin/categories` and `/api/admin/addons`)**

### Step 3: Frontend Admin Dashboard

A new section of the application will be created for administration.

1.  **Create Admin Layout:** A new layout at `cardapio/app/admin/layout.tsx` will be created to provide a consistent dashboard structure.

2.  **Create Dashboard Page:**
    *   The main dashboard page will be at `cardapio/app/admin/dashboard/page.tsx`.
    *   It will fetch all menu data and display it in tables using `shadcn/ui`'s `Table` component.
    *   Each table (Items, Categories, Add-ons) will have "Edit" and "Delete" buttons for each row.
    *   A "Create New" button will be present for each section.

3.  **Create/Edit Forms:**
    *   Clicking "Create New" or "Edit" will open a `Dialog` (modal) containing a form.
    *   The form will use `shadcn/ui` components like `Input`, `Textarea`, `Select` (for category selection), and `Checkbox` (for assigning add-ons).
    *   Submitting the form will call the appropriate backend API route.

### Step 4: Prisma Schema Review (Optional)

The existing schema will be reviewed to see if any additions are needed. For example, adding an `isAvailable` boolean field to the `MenuItem` model to allow temporarily disabling items without deleting them.
