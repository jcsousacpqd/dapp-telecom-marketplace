// server/routes/services.js
const express = require('express');
const router = express.Router();
const { db } = require('../data/db.js');

// POST /register-service
router.post('/register-service', (req, res) => {
  const {
    id,
    description,
    monthsAvailable,
    price,
    finalPrice,
    assetIds,
    slices
  } = req.body;

  if (!id || !description) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
  }

  db.services.push({
    id,
    description,
    monthsAvailable,
    price,
    finalPrice,
    assetIds,
    slices
  });

  return res.status(201).json({ message: 'Serviço registrado com sucesso' });
});

// GET /services
router.get('/services', (req, res) => {
  res.json(db.services);
});

module.exports = router;
