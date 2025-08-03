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

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Use the env variable directly
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

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
