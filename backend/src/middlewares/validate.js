const validateTask = (req, res, next) => {
  const { titre, description } = req.body;
  if (!titre || !description)
    return res.status(400).json({ message: 'titre et description sont requis' });
  next();
};

module.exports = { validateTask };