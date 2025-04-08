const express = require('express');
const router = express.Router();
const { loadJSON, saveJSON } = require('../data/db.js');

router.post('/register-service', (req, res) => {
  const {
    id, description, monthsAvailable,
    price, finalPrice, assetIds, slices
  } = req.body;

  if (!id || !description) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
  }

  const current = loadJSON('services');
  current.push({
    id, description, monthsAvailable,
    price, finalPrice, assetIds, slices
  });
  saveJSON('services', current);

  return res.status(201).json({ message: 'Serviço registrado com sucesso' });
});

router.get('/services', (req, res) => {
  const current = loadJSON('services');
  res.json(current);
});

module.exports = router;
