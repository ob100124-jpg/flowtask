const validateTask = (req, res, next) => {
  const { titre, priorite, statut } = req.body;

  if (!titre) {
    return res.status(400).json({ message: 'Le titre est obligatoire' });
  }

  const prioritesValides = ['basse', 'moyenne', 'haute'];
  if (priorite && !prioritesValides.includes(priorite)) {
    return res.status(400).json({ 
      message: 'Priorité invalide - choisir: basse, moyenne, haute' 
    });
  }

  const statutsValides = ['à faire', 'en cours', 'terminé'];
  if (statut && !statutsValides.includes(statut)) {
    return res.status(400).json({ 
      message: 'Statut invalide - choisir: à faire, en cours, terminé' 
    });
  }

  next();
};

module.exports = { validateTask };