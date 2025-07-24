const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const verifyAsync = promisify(jwt.verify);
const bcrypt = require("bcrypt");
const { User, RefreshToken } = require("../models"); // Asegúrate de que la ruta sea correcta
const { Op } = require("sequelize");

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m", // El token expira en 15 minutos
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // El refresh token expira en 7 días
  });
}

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validaciones básicas
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    // Verificar si el email o username ya están en uso
    const existingUser = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso." });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validaciones básicas
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    // Buscar el usuario por nombre de usuario
    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado." });

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Contraseña incorrecta." });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Guardar el refresh token en la base de datos
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira en 7 días
    });

    // Enviamos el refresh token como cookie segura (httpOnly)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // Enviamos el token de acceso en la respuesta
    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No se proporcionó el refresh token." });
  }

  try {
    // Verificar si el token existe en la base de datos
    const tokenBD = await RefreshToken.findOne({ where: { token } });
    if (!tokenBD) {
      return res.status(403).json({ message: "Refresh token no válido." });
    }

    // Verificar la firma del token de forma awaitable
    const decoded = await verifyAsync(token, process.env.REFRESH_TOKEN_SECRET);

    // Buscar usuario en base de datos
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Enviar nuevo token
    return res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error al verificar el refresh token:", error);
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    // Eliminar el refresh token de la base de datos
    await RefreshToken.destroy({ where: { token } });

    // Eliminar la cookie del refresh token
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Sesión cerrada exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar sesión." });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
