const express = require('express');
const router = express.Router();
const { loadJSON, saveJSON } = require('../data/db.js');

router.post('/register-asset', (req, res) => {
  const {
    id, description, amount, slices,
    monthsAvailable, totalPrice, pricePerSlice
  } = req.body;

  if (!id || !description) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
  }

  const current = loadJSON('assets');
  current.push({
    id, description, amount, slices,
    monthsAvailable, totalPrice, pricePerSlice
  });
  saveJSON('assets', current);

  return res.status(201).json({ message: 'Ativo registrado com sucesso' });
});

router.get('/assets', (req, res) => {
  const current = loadJSON('assets');
  res.json(current);
});

module.exports = router;
