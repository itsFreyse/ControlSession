const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const User = require('../models/user');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Ruta protegida
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario.' });
  }
});

module.exports = router;