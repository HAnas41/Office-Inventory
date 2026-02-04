# Office Inventory Management System - Backend

This is the backend application for the Office Inventory Management System, built with Node.js, Express, and MongoDB.

## Features

- **Role-Based Access Control**: Three-tier access system (Admin, Manager, Viewer)
- **Authentication**: JWT-based authentication with signup and login
- **Asset Management**: Full CRUD operations for office assets with role restrictions
- **User Management**: Admin-only user management capabilities
- **Category Management**: Admin-only category management
- **Reporting**: Various reports accessible to Admin and Manager roles
- **Secure Password Storage**: Passwords are hashed using bcrypt

## Tech Stack

- Node.js (v18+)
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Copy the example environment file: `cp .env .env.local`
5. Update the environment variables as needed

## Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongo_connection_string_here
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

## Running the Application

- Development: `npm run dev`
- Production: `npm start`

## Seeding Data

To seed the database with sample data:
- `npm run seed`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Assets

- `GET /api/assets` - Get all assets (all roles)
- `POST /api/assets` - Create asset (Admin only)
- `GET /api/assets/:id` - Get single asset (all roles)
- `PUT /api/assets/:id` - Update asset (Admin: full access, Manager: limited fields)
- `DELETE /api/assets/:id` - Delete asset (Admin only)

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user (Admin only)
- `PUT /api/users/:id` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Categories

- `GET /api/categories` - Get all categories (all roles)
- `POST /api/categories` - Create category (Admin only)
- `GET /api/categories/:id` - Get single category (all roles)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Reports

- `GET /api/reports/assets-by-category` - Assets by category (Admin & Manager)
- `GET /api/reports/assets-by-location` - Assets by location (Admin & Manager)
- `GET /api/reports/damaged-assets` - Damaged assets (Admin & Manager)
- `GET /api/reports/low-stock` - Low stock report (Admin only)

### Health Check

- `GET /health` - Health check endpoint

## Role-Based Access Control

- **Admin**: Full access to all features and data
- **Manager**: Can view assets, update status/assignment/location, view reports
- **Viewer**: Read-only access to assets

## Data Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- role (String, enum: admin/manager/viewer, required)

### Asset
- assetName (String, required)
- assetType (String, required, enum: Laptop/Desktop/Printer/Router/Chair/Table)
- serialNumber (String, required, unique)
- brand (String, required)
- model (String, required)
- purchaseDate (Date, required)
- condition (String, enum: New/Good/Fair/Poor/Damaged, default: Good)
- status (String, enum: Available/In Use/Damaged, default: Available)
- assignedTo (ObjectId ref: User, default: null)
- location (String, default: null)

### Category
- name (String, required, unique)
- description (String, optional)

## Security

- JWT-based authentication
- Role-based authorization middleware
- Password hashing with bcrypt
- Input validation
- Secure error handling
- CORS support

## Error Handling

The application implements comprehensive error handling including:
- Mongoose validation errors
- Duplicate key errors
- Cast errors (invalid ObjectIds)
- Custom error responses

## API Response Format

Successful responses follow the format:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses follow the format:
```json
{
  "success": false,
  "message": "Error description"
}
```