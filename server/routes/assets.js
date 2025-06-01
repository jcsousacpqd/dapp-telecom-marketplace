const express = require('express');
const router = express.Router();
const { loadJSON, saveJSON } = require('../data/db.js');

router.post('/register-asset', (req, res) => {
  const asset = req.body;

  if (!asset.id || !asset.description) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
  }

  const current = loadJSON('assets');
  current.push(asset);
  saveJSON('assets', current);

  return res.status(201).json({ message: 'Ativo registrado com sucesso' });
});

router.get('/assets', (req, res) => {
  const current = loadJSON('assets');
  res.json(current);
});

module.exports = router;
