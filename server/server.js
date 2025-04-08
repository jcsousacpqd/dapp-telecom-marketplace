const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ethers, Wallet } = require('ethers');
const TLCAbi = require('./TLCAbi.json');
const assetRoutes = require('./routes/assets');
const serviceRoutes = require('./routes/services');

dotenv.config();
const app = express();
const port = 3001;

// ✅ Corrigir CORS para aceitar chamadas do frontend
app.use(cors({
  origin: '*', // ou '*' para qualquer origem (não recomendado em produção)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use('/api', assetRoutes, serviceRoutes);

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
const ownerWallet = new Wallet(process.env.MARKETPLACE_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.TELECOIN_ADDRESS, TLCAbi.abi, ownerWallet);

app.post('/mint', async (req, res) => {
  const { to, amount } = req.body;

  if (!to || !amount) return res.status(400).json({ success: false, message: 'Dados inválidos' });

  try {
    const tx = await contract.mint(ethers.parseUnits(amount.toString(), 18));
    await tx.wait();

    const transferTx = await contract.withdraw(to, ethers.parseUnits(amount.toString(), 18));
    await transferTx.wait();

    res.json({ success: true, message: 'TLC mintado e transferido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao mintar TLC' });
  }
});

const { loadJSON, saveJSON } = require('./data/db.js');

app.post('/api/hired-asset', (req, res) => {
  const { assetId, renter, slices } = req.body;
  const current = loadJSON('hired-assets');
  current.push({ assetId, renter, slices });
  saveJSON('hired-assets', current);
  res.json({ message: '✅ Contratação registrada com sucesso.' });
});

app.get('/api/hired-assets', (req, res) => {
  const current = loadJSON('hired-assets');
  res.json(current);
});

app.post('/api/hired-services', (req, res) => {
  const { id, renter } = req.body;
  const current = loadJSON('hired-services');
  current.push({ id, renter });
  saveJSON('hired-services', current);
  res.json({ message: '✅ Service hire registered successfully.' });
});

app.get('/api/hired-services', (req, res) => {
  const current = loadJSON('hired-services');
  res.json(current);
});

app.listen(port, () => {
  console.log(`🟢 Backend pronto em http://localhost:${port}`);
});
