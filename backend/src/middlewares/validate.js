const validateTask = (req, res, next) => {
  const { titre } = req.body;
  if (!titre)
    return res.status(400).json({ message: 'Le titre est obligatoire' });
  next();
};

module.exports = { validateTask };