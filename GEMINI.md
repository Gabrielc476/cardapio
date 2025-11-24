# GEMINI Project Analysis: Cardápio Digital (Next.js)

## Project Overview

This project is a full-stack digital menu application built with Next.js. It allows users to browse menu items, view details, customize orders with add-ons, and manage a shopping cart. The UI is built with a modern, component-based approach.

**Key Technologies:**
*   **Framework:** Next.js (with App Router)
*   **Language:** TypeScript
*   **UI:** React, Tailwind CSS
*   **Component Library:** shadcn/ui
*   **State Management:** React Context (`CartProvider`)
*   **Mapping:** React-Leaflet

## Architecture

### Frontend
The frontend is built using React Server Components and Client Components, located in the `cardapio/app` directory.
*   **UI Components:** Reusable components are located in `cardapio/components`. UI elements from `shadcn/ui` (like `Button`, `Dialog`, `Card`) are stored in `cardapio/components/ui`.
*   **State Management:** Global state for the shopping cart is managed via React Context in `cardapio/contexts/cart-context.tsx`.
*   **Styling:** Styling is handled by Tailwind CSS, with global styles and CSS variables defined in `cardapio/app/globals.css`.

### Backend
The backend logic is handled by Next.js API Routes.
*   **Menu API:** The primary API endpoint is `app/api/menu/route.ts`, which is responsible for providing the menu data to the frontend. Currently, it serves a static JSON object.

## Building and Running

1.  **Install Dependencies:** Navigate to the `cardapio` directory and run:
    ```bash
    npm install
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
3.  Open your browser to `http://localhost:3000` to see the application.


## Database Integration Plan: SQLite + Prisma

To make the application's data persistent and more manageable, the following plan outlines the integration of a SQLite database using the Prisma ORM.

### Objective
Replace the static, file-based menu data with a persistent SQLite database. This will allow for easier management and future expansion of the menu.

### Technology Stack
*   **Database:** SQLite
*   **ORM (Object-Relational Mapping):** Prisma

### Implementation Steps

1.  **Install Prisma:** Add the Prisma CLI as a development dependency.
    ```bash
    npm install prisma --save-dev
    ```

2.  **Initialize Prisma:** Set up the Prisma environment, which will create a `prisma` directory with a `schema.prisma` file and a `.env` file for the database URL.
    ```bash
    npx prisma init --datasource-provider sqlite
    ```

3.  **Define Database Schema:** The `prisma/schema.prisma` file will be updated to model the application's data structures, including `Category`, `MenuItem`, and `Addon`.

4.  **Apply Schema & Generate Client:** The schema will be applied to the database, and the Prisma Client will be generated.
    ```bash
    npx prisma db push
    npx prisma generate
    ```

5.  **Create Seed Script:** A seed script (`prisma/seed.ts`) will be created to populate the SQLite database with the initial menu data from the original project. This script will be executed via a `package.json` script.

6.  **Update API Route:** The API route at `app/api/menu/route.ts` will be refactored. Instead of returning a hardcoded object, it will use the generated Prisma Client to fetch data dynamically from the SQLite database.

## Authentication System Plan: JWT

A new authentication system will be implemented to manage users and protect routes.

### Objective
To create a secure authentication system using JSON Web Tokens (JWT) that supports different user roles (`FUNCIONARIO`, `ADMIN`).

### Technology Stack
*   **Password Hashing:** `bcryptjs`
*   **JWT Handling:** `jose`
*   **Middleware:** Next.js Middleware for route protection.

### Implementation Steps

1.  **Update Database Schema:** A `User` model will be added to the `prisma/schema.prisma` file. It will include fields for email, name, hashed password, and a `Role` enum.
    ```prisma
    enum Role {
      FUNCIONARIO
      ADMIN
    }

    model User {
      id        Int      @id @default(autoincrement())
      email     String   @unique
      name      String
      password  String
      role      Role     @default(FUNCIONARIO)
      createdAt DateTime @default(now())
    }
    ```

2.  **Apply Schema:** The new schema will be applied to the database.
    ```bash
    npx prisma db push
    ```

3.  **Install Dependencies:**
    ```bash
    npm install bcryptjs jose
    npm install -D @types/bcryptjs
    ```

4.  **Create Authentication API Routes:**
    *   `POST /api/auth/register`: A public route for new users to register. It will hash the password before saving the user to the database.
    *   `POST /api/auth/login`: A public route for users to log in. It will validate credentials and return a signed JWT.
    *   `GET /api/auth/me`: A protected route that will validate the JWT from the request and return the current user's data.

5.  **Create Auth Context and Hooks:** An `AuthContext` (`cardapio/contexts/auth-context.tsx`) will be created to manage the user's authentication state globally (token, user data, loading state).

6.  **Implement Frontend Pages:**
    *   Create `Login` and `Register` pages (`/login`, `/register`) with forms for user input.
    *   The main `Header` will be updated to show the user's name and a "Logout" button when logged in, or the "Login" and "Cadastre-se" buttons when logged out.

7.  **Create Protected Route Middleware:** A `middleware.ts` file will be created at the root of the project to protect pages and API routes. It will inspect the JWT from the request cookies and redirect unauthenticated users.

## Troubleshooting & Development Notes

### WARNING: Unstable Dependencies
This project is currently using an unstable and likely invalid version of Next.js (`16.0.3`) and an incompatible version of React (`19.x.x`). This was likely caused by running `npm audit fix --force`. This unstable environment is the root cause of several unusual errors, including module resolution failures and problems with Next.js's core features like image optimization.

**It is strongly recommended to downgrade Next.js and its peer dependencies (like React) to a known stable version (e.g., Next.js 14 and React 18) to ensure project stability.**

---

During the integration of Prisma and the authentication system, several issues were encountered. This section documents them for future reference.

### 1. Image Loading Errors (Previously Identified)
*   **Symptom:** The error `The requested resource isn't a valid image for /img/cheese.png` occurs.
*   **Root Cause:** This is likely due to the unstable version of Next.js causing its internal image optimization component to fail.
*   **Workaround:** As a temporary diagnostic step, the `<Image>` component from `next/image` was replaced with a standard `<img>` tag to bypass the optimization system.

### 2. Prisma Configuration and Versioning

*   **Symptom:** A series of cascading errors after running `npm audit fix --force`, including `Cannot find module '@prisma/client/runtime/...'`, `Argument "url" is missing`, and conflicting configuration errors.
*   **Root Cause:** The `npm audit fix --force` command upgraded Prisma to an unstable or incompatible major version. This led to a conflict between the `prisma.config.ts` file (a newer feature) and the `schema.prisma` file, causing the Prisma CLI to become confused about where to source the database URL.
*   **Solution:**
    1.  The `prisma` and `@prisma/client` packages were manually downgraded to a known stable version (e.g., `^5.17.0`).
    2.  The `prisma.config.ts` file was deleted to simplify the configuration.
    3.  The `datasource db { url = env("DATABASE_URL") }` was re-added to `schema.prisma`.
    4.  The `prisma: { seed: "..." }` configuration was moved back into `package.json`.
    5.  A clean install was performed (`rm -rf node_modules`, `npm install`) to resolve any corruption.

### 3. Prisma Schema for SQLite

*   **Symptom:** `Error validating: You defined the enum 'Role'. But the current connector does not support enums.`
*   **Root Cause:** SQLite does not have native support for `enum` types.
*   **Solution:** The `enum Role` was removed from `schema.prisma` and the `role` field in the `User` model was changed to a `String` with a default value (e.g., `String @default("FUNCIONARIO")`).

### 4. Missing Database Tables

*   **Symptom:** API calls failed with the error `The table 'main.User' does not exist in the current database.`
*   **Root Cause:** The database schema changes (like adding the `User` model) were not successfully applied to the SQLite database file, even after previous `prisma generate` or `db push` commands seemed to succeed. This was due to the configuration/versioning issues mentioned above.
*   **Solution:** After fixing the configuration and downgrading Prisma, running `npx prisma db push` successfully synchronized the schema and created the missing tables.

### 5. API returning HTML instead of JSON

*   **Symptom:** Frontend `fetch` calls failed with `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`.
*   **Root Cause:** The Next.js middleware was redirecting unauthenticated API requests (like `/api/auth/me`) to the HTML login page. The frontend code expected a JSON response and failed when trying to parse the received HTML.
*   **Solution:** The middleware was updated to check if a request is for an API route (`pathname.startsWith('/api')`). If it is, it now returns a proper JSON error with a `401 Unauthorized` status instead of redirecting.

### 6. Image Loading Errors (Current)
*   **Symptom:** `⨯ The requested resource isn't a valid image for /img/cheese.png received null`.
*   **Root Cause:** This is another manifestation of the unstable Next.js version (`16.0.3`) causing issues with its internal image optimization. The `<Image>` component from `next/image` is likely failing to correctly process or load the image.
*   **Workaround:** As a temporary diagnostic step and to unblock development, you can replace instances of the `<Image>` component from `next/image` with a standard `<img>` tag. This bypasses Next.js's image optimization which seems to be the source of the error. You might need to adjust styling (e.g., `width`, `height`, `object-fit`) if you switch to `<img>`.

    For example, in `cardapio/components/menu-item-card.tsx` and `cardapio/components/item-modal.tsx`, you'll find lines similar to:
    ```tsx
    <Image
      src={item.imagem}
      alt={item.nome}
      width={200} // or other dimensions
      height={200} // or other dimensions
      className="rounded-full mx-auto mb-4"
    />
    ```
    You would change this to:
    ```tsx
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={item.imagem}
      alt={item.nome}
      className="h-full w-full object-contain" // or adjust as needed
    />
    ```
    Note the `eslint-disable-next-line` comment to suppress potential linting warnings about using `<img>` directly in Next.js.
