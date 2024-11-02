# User Management Dashboard API

## Overview
This project is a backend dashboard designed for managing user data and viewing analytics. The primary goal is to create a simple, functional API that supports typical admin operations while emphasizing code structure, security, and scalability.

## Features
- User registration and authentication
- User data management (CRUD operations)
- Role-based access control
- Secure and scalable architecture

## API Endpoints

### User Management
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get user by ID
- **PUT** `/users/:id` - Update user by ID
- **DELETE** `/users/:id` - Delete user by ID

### Dashboard
- **GET** `users/dashboard` - Get user-specific dashboard data

### Role Management
- **POST** `/roles/add` - Add a new role


## Technologies Used
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing user data
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB
- **JWT (JSON Web Tokens)**: For secure authentication
- **Helmet**: Middleware for securing HTTP headers
- **Rate Limiting**: To prevent abuse of the API
- **CORS**: Middleware to enable Cross-Origin Resource Sharing

### Prerequisites
- Node.js
- MongoDB (local or MongoDB Atlas)
- A package manager (npm or yarn)

## Installation
1. **Clone the repository:**
   git clone https://github.com/Janofar/my-projects.git
2. **Install dependencies:**
   npm install or yarn install
3. **Start server:**
   npm start 
4. **Run test:**
   npm test