# E-Commerce Backend (TypeScript + Node.js + MongoDB)

This is a backend server for an e-commerce application built using Node.js, Express.js, MongoDB, and TypeScript. It handles user authentication, product management, orders, and other essential functionalities.

# 🚀 Features

User Authentication (Register, Login, JWT-based Auth)

Product Management (CRUD Operations)

Cart & Wishlist Functionality

Order Processing

Secure Password Hashing (bcrypt)

File Uploads (multer)

Email Notifications (nodemailer)

# 🛠️ Installation & Setup

1️⃣ Clone the Repository

git clone git@github.com:AayushcodesFX/e-commerce-backend.git
cd e-commerce-backend

2️⃣ Install Dependencies

npm install

3️⃣ Setup Environment Variables

Create a .env file in the root directory and configure it:

PORT=8000
DB_URI=mongodb+srv://your-mongo-db-uri
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password

4️⃣ Run the Server

# For Development:

npm run dev

For Production:

npm run build
npm start

# 📌 API Routes

# 🔑 Authentication

POST /api/auth/register → Register a new user

POST /api/auth/login → User login

GET /api/auth/profile → Get user profile (Authenticated)

# 🛒 Products

GET /api/products → Get all products

POST /api/products → Add a new product (Admin)

PUT /api/products/:id → Update a product (Admin)

DELETE /api/products/:id → Delete a product (Admin)

# 🛍️ Orders & Cart

POST /api/orders → Place an order

GET /api/orders → Get user orders (Authenticated)

POST /api/cart → Add item to cart

DELETE /api/cart/:id → Remove item from cart

# ⚙️ Tech Stack

Backend: Node.js, Express.js, TypeScript

Database: MongoDB, Mongoose

Auth: JWT, bcrypt.js

File Uploads: Multer

Email Notifications: Nodemailer

✅ Best Practices Implemented

TypeScript for Type Safety

Environment Variables for Security

Global Error Handling Middleware

Modular Route & Controller Structure

# 🛠️ Contributing

Fork the repo

Create a new branch (git checkout -b feature-branch)

Commit changes (git commit -m 'Added a new feature')

Push to your branch (git push origin feature-branch)

Create a Pull Request

