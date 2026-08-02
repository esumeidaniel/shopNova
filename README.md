# SHOPNOVA

SHOPNOVA is separated into a React frontend and an Express backend.

## Project Structure

```txt
SHOPNOVA/
  frontend/
    React + Vite customer/admin UI

  backend/
    Node.js + Express API
    MongoDB with JSON fallback for local development
    auth/products/cart/wishlist/orders/customer/admin/uploads/payments modules
```

## Fresh Setup

Install dependencies inside each app:

```bash
cd frontend
npm install

cd ../backend
npm install
```

Generated folders such as `node_modules`, `dist`, `frontend/dist`, `backend/uploads`, logs, and `.env` files are ignored by Git.

## Run Frontend

```bash
cd frontend
npm run dev
```

Frontend default URL:

```txt
http://127.0.0.1:5173
```

If that port is busy, Vite will choose another port.

## Run Backend

```bash
cd backend
npm start
```

Backend URL:

```txt
http://127.0.0.1:4000
```

Health check:

```txt
GET http://127.0.0.1:4000/api/health
```

## Backend Stack

```txt
Node.js
Express
JWT
bcrypt
Helmet
express-rate-limit
Nodemailer optional SMTP
Multer
CORS
dotenv
MongoDB / Mongoose with local JSON fallback
Cloudinary product image uploads
```

## Local Test Account

```txt
Admin: admin@shopnova.ng / password123
```

This account is for local development only. Never enable seed accounts in production.
Create the first production owner after MongoDB is connected by temporarily setting
`ADMIN_EMAIL` and `ADMIN_PASSWORD` and running `npm run create:admin` in a Render shell.
Remove both variables immediately afterward.

## Deployment

The project includes `render.yaml` for deploying the backend on Render.

Backend environment variables:

```txt
NODE_ENV=production
PORT=4000
CLIENT_URL=https://your-shopnova-project.vercel.app
JWT_SECRET=replace_with_a_random_32_plus_byte_secret
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/shopnova
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=SHOPNOVA <no-reply@example.com>
GOOGLE_CLIENT_ID=optional_google_client_id
GOOGLE_CLIENT_SECRET=optional_google_client_secret
PAYSTACK_SECRET_KEY=sk_live_replace_me
PAYSTACK_PUBLIC_KEY=pk_live_replace_me
REQUIRE_EMAIL_VERIFICATION=true
ALLOW_SEED_ACCOUNTS=false
```

Frontend environment variable for a real deployed backend:

```txt
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_GOOGLE_CLIENT_ID=optional_google_client_id
VITE_PAYSTACK_PUBLIC_KEY=pk_live_replace_me
VITE_ENABLE_DEMO_FALLBACK=false
```

Demo fallback is local-only and should stay off for production:

```txt
VITE_ENABLE_DEMO_FALLBACK=true
```

Only use that while previewing on `localhost` or `127.0.0.1`.

## MongoDB Atlas

If MongoDB connection fails, open:

```txt
MongoDB Atlas → Network Access → Add IP Address
```

Add your current IP for local development. For hosted backend deployment, add the hosting provider's outbound IP/access rule. Until Atlas allows the connection, the backend falls back to `backend/data/db.json` so development does not stop.

## Admin Product Upload

Admin product image upload works through:

```txt
POST /api/uploads/product-image
```

It requires:

```txt
Cloudinary env vars
Admin login token
Running/deployed backend
```

## Payments

Pay on Delivery works without extra setup. Paystack endpoints are available when `PAYSTACK_SECRET_KEY` is configured:

```txt
POST /api/payments/paystack/initialize
POST /api/payments/paystack/verify/:reference
```

Orders are only marked paid after Paystack verification.

## Connected Store Actions

The frontend now calls backend routes for:

```txt
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/send-verification
POST /api/auth/verify-email
PATCH /api/customer/password
POST /api/contact
POST /api/coupons/validate
GET /api/orders/:id/invoice
GET /api/admin/orders/export
PATCH /api/admin/inventory/:id
PATCH /api/admin/categories/:id
PATCH /api/admin/coupons/:id
POST /api/payments/paystack/initialize
POST /api/payments/paystack/verify
```

## Start With An Empty Catalog

SHOPNOVA no longer ships customer-facing sample products. To clear old local or MongoDB sample data, run:

```bash
cd backend
npm run clear:catalog
```

This clears:

```txt
products
orders
coupons
carts
wishlists
```

It keeps:

```txt
user accounts
store settings
```
