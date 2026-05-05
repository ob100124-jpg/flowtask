const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Non autorisé' });

  try {
    const token  = header.split(' ')[1]; // extraire le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email } dispo dans la route
     next(); // continuer vers la route
  } catch {
    return res.status(401).json({ message: 'Token invalide' });    
  }
};
const auth = require('../middlewares/auth');

router.get('/projects', auth, async (req, res) => {
    
  const userId = req.user.id;

});