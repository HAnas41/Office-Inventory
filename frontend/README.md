# Office Inventory Management System - Frontend

This is the frontend application for the Office Inventory Management System, built with Next.js and Tailwind CSS.

## Features

- **Role-Based Access Control**: Different views and permissions for Admin, Manager, and Viewer roles
- **Asset Management**: Full CRUD operations for office assets with proper role restrictions
- **User Management**: Admin-only user management capabilities
- **Category Management**: Admin-only category management
- **Reporting**: Various reports accessible to Admin and Manager roles
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- JavaScript

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Copy the example environment file: `cp .env.example .env.local`
5. Update the environment variables as needed

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL of the backend API (default: http://localhost:5000)

## Running the Application

- Development: `npm run dev`
- Production Build: `npm run build`
- Start Production Server: `npm start`

## Available Pages

- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Role-specific dashboard
- `/assets` - View all assets
- `/assets/new` - Add new asset (Admin only)
- `/users` - User management (Admin only)
- `/categories` - Category management (Admin only)
- `/reports` - Reports (Admin and Manager)

## Role-Based Access

- **Admin**: Full access to all features
- **Manager**: Can view assets, update status and assignments, view reports
- **Viewer**: Read-only access to assets

## API Integration

The frontend communicates with the backend API using the environment variable `NEXT_PUBLIC_API_URL`. All API calls are properly authenticated using JWT tokens stored in localStorage.

## Security

- JWT-based authentication
- Role-based UI rendering
- Protected routes
- Secure token storage