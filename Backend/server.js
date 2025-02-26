require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};
connectDB();

const productApi = require("./routes/productRoutes");
const userApi = require("./routes/authRoutes");
const superAdminApi = require("./routes/adminRoutes");
const businessApi = require("./routes/sellerRoutes");
const cartApi = require("./routes/cartRoutes");
const checkoutApi = require("./routes/checkoutRoutes")
const orderApi = require("./routes/orderRoutes");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(businessApi);
app.use(checkoutApi)
app.use(productApi);
app.use(userApi);
app.use(superAdminApi);
app.use(orderApi);
app.use(cartApi);

app.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/", 
  });

  res.status(200).json({ message: "Logged out successfully" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});