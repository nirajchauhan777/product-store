# MERN E-commerce Project

This repository contains a complete **MERN (MongoDB, Express, React, Node)** e-commerce application with:

- ✅ User registration & login (JWT + bcrypt)
- ✅ Product listing + details
- ✅ Cart management + checkout
- ✅ Order history
- ✅ Admin panel (manage products, users, orders)

---

## ✅ Project Structure

```
project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started (Local Setup)

### 1) Backend Setup

```bash
cd backend
cp .env.example .env
# Update .env with your MongoDB URI and a JWT secret

npm install
npm run dev
```

The backend will start on `http://localhost:5000` by default.

### 2) Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` by default.

---

## 📦 API Routes (Backend)

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT

### Users
- `GET /api/users/profile` — Get logged-in user profile
- `GET /api/users` — (admin) List all users

### Products
- `GET /api/products` — List products
- `GET /api/products/:id` — Single product
- `POST /api/products` — (admin) Create product
- `PUT /api/products/:id` — (admin) Update product
- `DELETE /api/products/:id` — (admin) Delete product

### Cart
- `GET /api/cart` — Get current cart
- `POST /api/cart/add` — Add product to cart
- `DELETE /api/cart/remove` — Remove product from cart

### Orders
- `POST /api/orders` — Create order from cart
- `GET /api/orders` — Get user orders (admin gets all)

---

## 🔐 Notes

- Backend requires `JWT_SECRET` and `MONGO_URI`.
- Frontend uses `VITE_API_URL` to connect to backend.
- Admin access is controlled by the `role` field in the user model (`user` or `admin`).

---

## ✅ Next Enhancements (Optional)

- Add payment processing (e.g., Stripe)
- Add image uploads for products
- Improve form validation
- Add user address management
- Add pagination and filters for products

---

Happy coding! 🎉
