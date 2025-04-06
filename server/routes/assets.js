const express = require('express');
const router = express.Router();
const { db } = require('../data/db.js');

let registeredAssets = [];

console.log(registeredAssets)
router.post('/register-asset', (req, res) => {
  const {
    id,
    description,
    amount,
    slices,
    monthsAvailable,
    totalPrice,
    pricePerSlice
  } = req.body;

  if (!id || !description) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
  }

  db.assets.push({
    id,
    description,
    amount,
    slices,
    monthsAvailable,
    totalPrice,
    pricePerSlice
  });

  return res.status(201).json({ message: 'Ativo registrado com sucesso' });
});

router.get('/assets', (req, res) => {
  res.json(db.assets);
});

module.exports = router;
