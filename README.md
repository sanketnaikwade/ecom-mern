# 🛒 E-Commerce Application — MERN Stack

A full-stack e-commerce app with product listing, category filtering, cart, and simulated checkout.

## Project Structure
```
ecommerce-app/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── server.js        ← Auto-seeds 6 sample products
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env
    └── package.json
```

## Setup & Run (Local)

### 1. Configure .env files

**backend/.env**
```
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommercedb?retryWrites=true&w=majority
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:5001/api
```

### 2. Run Backend
```bash
cd backend
npm install
npm run dev        # development (nodemon)
# OR
npm start          # production
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm start
```

App runs at: http://localhost:3000
API runs at: http://localhost:5001

> **Note:** On first run, backend auto-seeds 6 sample products into MongoDB Atlas.

## Features
- Browse products with category filter
- Add to cart, update quantities
- Remove items from cart
- Checkout form (simulated order placement)
- Orders saved to MongoDB

## API Endpoints
| Method | Route             | Description          |
|--------|------------------|----------------------|
| GET    | /api/products     | Get all products     |
| GET    | /api/products/:id | Get single product   |
| POST   | /api/orders       | Place order          |
| GET    | /api/orders       | Get all orders       |

---

## AWS EC2 Deployment

### Step 1 — Launch EC2
- AMI: Ubuntu 22.04 LTS
- Instance type: t2.micro
- Security Group inbound:
  - SSH: 22, HTTP: 80, Custom TCP: 5001

### Step 2 — Install Node.js & PM2
```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
sudo apt install nginx -y
```

### Step 3 — Deploy Backend
```bash
scp -r -i your-key.pem ecommerce-app ubuntu@<EC2_PUBLIC_IP>:/home/ubuntu/
cd /home/ubuntu/ecommerce-app/backend
npm install
nano .env   # Set MONGO_URI
pm2 start server.js --name ecommerce-backend
pm2 save && pm2 startup
```

### Step 4 — Build & Deploy Frontend
```bash
cd /home/ubuntu/ecommerce-app/frontend
nano .env   # Set REACT_APP_API_URL=http://<EC2_PUBLIC_IP>:5001/api
npm install && npm run build
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx
```

Access at: http://<EC2_PUBLIC_IP>
