require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth.routes.js");
const connecttDB = require("./libs/db.js");
const messageRoutes = require("./routes/message.routes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { server, app, io } = require("./libs/socket.js");
const PORT = process.env.PORT;

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// Simple CORS setup with explicit check
const corsOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

console.log("CORS Origin:", corsOrigin);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.options('*', cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
// MIDDLEWARE TO INJECT IO
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
connecttDB();
