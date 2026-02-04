# Office Inventory Management System

A full-stack web application for managing and tracking office assets with role-based access control.

## Features

- **Role-Based Access Control**: Admin, Manager, and Viewer roles with specific permissions
- **Asset Management**: Track office assets with detailed information
- **User Management**: Manage users and assign roles
- **Reporting**: Generate various reports for asset tracking
- **Responsive UI**: Modern interface built with Next.js and Tailwind CSS

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- JavaScript

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local instance or cloud Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongo_connection_string_here
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Assets
- `GET /api/assets` - Get all assets (all roles)
- `POST /api/assets` - Create asset (admin only)
- `GET /api/assets/:id` - Get specific asset (all roles)
- `PUT /api/assets/:id` - Update asset (admin & manager)
- `DELETE /api/assets/:id` - Delete asset (admin only)

### Categories
- `GET /api/categories` - Get all categories (all roles)
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Reports
- `GET /api/reports/assets-by-category` - Assets by category (admin & manager)
- `GET /api/reports/assets-by-location` - Assets by location (admin & manager)
- `GET /api/reports/damaged-assets` - Damaged assets (admin & manager)
- `GET /api/reports/low-stock` - Low stock report (admin only)

## Role Permissions

### Admin
- Full system access
- Create, update, delete assets
- View reports
- Create users
- Update asset status, condition, and location
- Manage categories
- Manage users

### Manager
- View all assets
- Update asset status and assignment
- View reports
- Cannot delete assets
- Cannot manage users or categories

### Viewer
- Read-only access to assets
- No modification permissions

## Usage

1. Register a new account with the role of your choice (Admin, Manager, or Viewer)
2. Login with your credentials
3. Access the dashboard to view assets based on your role
4. Admins can add new assets, manage users, and view all reports
5. Managers can update asset status and assignments
6. Viewers can only view assets

## Project Structure

```
office-inventory/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── config/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── context/
│   └── package.json
├── README.md
└── Office_Inventory_Project_Constitution.md
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based authorization is enforced on all API endpoints
- Input validation is implemented
- Sensitive data is not exposed in responses

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request