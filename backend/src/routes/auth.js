const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Email déjà utilisé ?
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email déjà utilisé' });

     // 2. Créer l'utilisateur (pre('save') hache le mdp)
    const user = new User({ fullName, email, password });
    await user.save();

    res.status(201).json({ message: 'Compte créé avec succès' });
    } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Utilisateur existe ?
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Identifiants incorrects' });

    // 2. Mot de passe correct ?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Identifiants incorrects' });

    // 3. Générer le token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },  // payload
      process.env.JWT_SECRET,               // clé secrète (.env)
      { expiresIn: process.env.JWT_EXPIRES_IN } // ex: '7d'
    );

    res.json({ token, user: { id: user._id, fullName: user.fullName } });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;        