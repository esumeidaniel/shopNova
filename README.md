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
JSON database for local development
MongoDB/Mongoose dependency ready for the next phase
Cloudinary dependency ready for product image storage
```

## Test Accounts

```txt
Customer: customer@shopnova.ng / password123
Admin:    admin@shopnova.ng / password123
```

## Next Step

The backend API is ready. The next work is connecting the React frontend screens to the backend endpoints.
