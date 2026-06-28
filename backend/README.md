# SHOPNOVA Backend

This backend is intentionally simple and easy to follow.

## Structure

```txt
backend/
  package.json
  .env.example

  data/
    db.json

  uploads/

  src/
    server.js
    app.js

    config/
      env.js

    data/
      seedData.js

    shared/
      auth.js
      db.js
      helpers.js
      upload.js

    modules/
      auth/
        auth.routes.js
        auth.controller.js
      products/
        products.routes.js
        products.controller.js
      cart/
        cart.routes.js
        cart.controller.js
      wishlist/
        wishlist.routes.js
        wishlist.controller.js
      orders/
        orders.routes.js
        orders.controller.js
      customer/
        customer.routes.js
        customer.controller.js
      checkout/
        checkout.routes.js
        checkout.controller.js
      admin/
        admin.routes.js
        admin.controller.js
      uploads/
        uploads.routes.js
        uploads.controller.js
```

## How It Works

`server.js`

Starts the backend.

`app.js`

Creates the Express app, connects middleware, and mounts all API modules.

`config/env.js`

Loads environment variables like the backend port and frontend URL.

`shared/db.js`

Reads and writes the local JSON database at `backend/data/db.json`.

`shared/auth.js`

Creates JWT tokens and protects routes that need login/admin access.

`shared/upload.js`

Handles product image uploads with Multer.

`shared/helpers.js`

Small helper functions for slugs and money formatting.

`data/seedData.js`

Starter data for products, users, categories, orders, coupons, and settings.

`modules/`

Each folder is one backend area. This is the main structure to understand:

```txt
auth       login, signup, current user
products   list, search, create, edit, delete products
cart       customer cart
wishlist   saved products
orders     customer orders and order details
customer   profile and addresses
checkout   legacy checkout endpoint
admin      dashboard, orders, customers, categories, inventory, coupons, settings
uploads    product image upload
```

Inside each module:

```txt
*.routes.js      defines the API URLs
*.controller.js  contains what happens when a URL is called
```

Example:

```txt
POST /api/auth/login
→ modules/auth/auth.routes.js
→ modules/auth/auth.controller.js
→ shared/db.js
→ backend/data/db.json
```

## Run

From the project root:

```bash
npm run backend
```

Or from this folder:

```bash
npm run dev
```

Default backend URL:

```txt
http://127.0.0.1:4000
```

## Environment Variables

Create this file for real local secrets:

```txt
backend/.env
```

Use `backend/.env.example` as the template, then add your real Cloudinary values:

```txt
CLOUDINARY_CLOUD_NAME=your_real_cloud_name
CLOUDINARY_API_KEY=your_real_api_key
CLOUDINARY_API_SECRET=your_real_api_secret
```

Do not put real secrets in `.env.example`.

## Test Accounts

```txt
Customer: customer@shopnova.ng / password123
Admin:    admin@shopnova.ng / password123
```

## Main Routes

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

GET    /api/customer/profile
PUT    /api/customer/profile
GET    /api/customer/addresses
POST   /api/customer/addresses
PATCH  /api/customer/addresses/:id
DELETE /api/customer/addresses/:id

GET    /api/cart
PUT    /api/cart
DELETE /api/cart

GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId

GET    /api/orders
POST   /api/orders
GET    /api/orders/:id

POST   /api/checkout

GET    /api/admin/dashboard
GET    /api/admin/orders
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id
GET    /api/admin/customers
GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
GET    /api/admin/inventory
GET    /api/admin/coupons
POST   /api/admin/coupons
PATCH  /api/admin/coupons/:id
GET    /api/admin/settings
PUT    /api/admin/settings

POST   /api/uploads/product-image
```

Protected routes use:

```txt
Authorization: Bearer <token>
```
