require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cloudinary = require("./config/cloudinary"); 
const uploadRoutes = require("./routes/uploadRoutes"); 
const app = express();

app.use(helmet()); 
app.use(morgan("dev")); 
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

const connectDatabase =
async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Successfully connected to Database");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};
connectDatabase();

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.get("/", (req, res) => {
  res.send("Welcome to the E-Commerce API");
});

app.use(uploadRoutes); 
app.use(sellerRoutes);
app.use(checkoutRoutes);
app.use(productRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(orderRoutes);
app.use(cartRoutes);

app.post("/api/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  });

  if (req.session) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
    });
  }

  res.status(200).json({ message: "Successfully logged out" });
});

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});