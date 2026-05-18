const validateTask = (req, res, next) => {
  const { titre } = req.body;
  if (!titre )
    return res.status(400).json({ message: 'titre et description sont requis' });
  next();
};

module.exports = { validateTask };