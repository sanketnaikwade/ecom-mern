const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    seedProducts();
  })
  .catch((err) => console.error("MongoDB Error:", err));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Seed sample products
const Product = require("./models/Product");

async function seedProducts() {
  const count = await Product.countDocuments();

  if (count === 0) {
    await Product.insertMany([
      {
        name: "Wireless Headphones",
        price: 2999,
        category: "Electronics",
        stock: 15,
        description: "High quality wireless headphones with noise cancellation.",
      },
      {
        name: "Running Shoes",
        price: 1499,
        category: "Footwear",
        stock: 30,
        description: "Lightweight and comfortable running shoes.",
      },
      {
        name: "Coffee Mug",
        price: 299,
        category: "Kitchen",
        stock: 50,
        description: "Ceramic coffee mug, 350ml capacity.",
      },
      {
        name: "Backpack",
        price: 1199,
        category: "Bags",
        stock: 20,
        description: "Durable 30L backpack with laptop compartment.",
      },
      {
        name: "Desk Lamp",
        price: 799,
        category: "Electronics",
        stock: 25,
        description: "LED desk lamp with adjustable brightness.",
      },
      {
        name: "Notebook Set",
        price: 199,
        category: "Stationery",
        stock: 100,
        description: "Set of 3 ruled notebooks, A5 size.",
      },
    ]);

    console.log("Sample products seeded");
  }
}

// Serve React Frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Server Port
const PORT = process.env.PORT || 5005;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});