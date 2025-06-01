const express = require('express');
const router = express.Router();
const { loadJSON, saveJSON } = require('../data/db.js');

router.post('/register-service', (req, res) => {
  const service = req.body;

  if (!service.id || !service.description) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
  }

  const current = loadJSON('services');
  current.push(service);
  saveJSON('services', current);

  return res.status(201).json({ message: 'Serviço registrado com sucesso' });
});

router.get('/services', (req, res) => {
  const current = loadJSON('services');
  res.json(current);
});

module.exports = router;
