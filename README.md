# SHOPNOVA

SHOPNOVA is separated into a React frontend and an Express backend.

## Project Structure

```txt
SHOPNOVA/
  frontend/
    React + Vite customer/admin UI

  backend/
    Node.js + Express API
    JSON database for local development
    routes/controllers/middleware structure
```

## Run Frontend

```bash
npm run frontend
```

Frontend default URL:

```txt
http://127.0.0.1:5173
```

If that port is busy, Vite will choose another port.

## Run Backend

```bash
npm run backend
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
Multer
CORS
dotenv
MongoDB / Mongoose with local JSON fallback
Cloudinary product image uploads
```

## Test Accounts

```txt
Customer: customer@shopnova.ng / password123
Admin:    admin@shopnova.ng / password123
```

## Deployment

The project includes `render.yaml` for deploying the backend on Render.

Backend environment variables:

```txt
NODE_ENV=production
CLIENT_URL=https://esumeidaniel.github.io
JWT_SECRET=your_long_secret
MONGODB_URI=your_mongodb_atlas_uri
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Frontend environment variable for a real deployed backend:

```txt
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_ENABLE_DEMO_FALLBACK=false
```

For GitHub Pages static preview only, leave `VITE_API_URL` empty or set:

```txt
VITE_ENABLE_DEMO_FALLBACK=true
```

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
