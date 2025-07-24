const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // El token se espera en el formato "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de acceso no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    next(); // Continuar con la siguiente función middleware o ruta
  } catch (error) {
    return res.status(401).json({ error: "Token de acceso inválido." });
  }
}

module.exports = authMiddleware;