const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();

// Seguridad y buenas prácticas
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Limitación de tasa para prevenir ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 solicitudes por IP
});
app.use(limiter);

// Cookie Parser
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);

module.exports = app;
