// Base inicial de frontend inspirado na identidade visual fornecida
// Utiliza React + Tailwind + Ethers.js + estrutura modular

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import TelecoinABI from '@/contracts/Telecoin.json';
import AssetsABI from '@/contracts/AssetsContract.json';
import { TELECOIN_ADDRESS, ASSETS_ADDRESS } from '@/utils/constants';

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');

  const [newAsset, setNewAsset] = useState({
    id: '',
    description: '',
    amount: '',
    slices: '',
    monthsAvailable: '',
    totalPrice: '',
    pricePerSlice: ''
  });

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        const signer = prov.getSigner();
        const acc = await signer.getAddress();

        setProvider(prov);
        setSigner(signer);
        setAccount(acc);
        await loadAssets(prov);
      }
    }
    init();
  }, []);

  async function loadAssets(provider) {
    const contract = new ethers.Contract(ASSETS_ADDRESS, AssetsABI, provider);
    const ids = ['tower01', 'fiber02'];
    const results = await Promise.all(ids.map(async (id) => {
      const data = await contract.getAssets(id);
      return { id, ...data };
    }));
    setAssets(results);
  }

  async function handleHire(assetId) {
    const contract = new ethers.Contract(ASSETS_ADDRESS, AssetsABI, signer);
    const tx = await contract._hireAsset(assetId, 1, account, account);
    await tx.wait();
    alert('Ativo contratado com sucesso!');
  }

  async function handleCreateAsset() {
    const contract = new ethers.Contract(ASSETS_ADDRESS, AssetsABI, signer);
    const tx = await contract.CreateAssetsRegistry(
      newAsset.id,
      newAsset.description,
      ethers.utils.parseUnits(newAsset.amount, 18),
      parseInt(newAsset.slices),
      parseInt(newAsset.monthsAvailable),
      ethers.utils.parseUnits(newAsset.totalPrice, 18),
      ethers.utils.parseUnits(newAsset.pricePerSlice, 18)
    );
    await tx.wait();
    alert('Ativo cadastrado com sucesso!');
    await loadAssets(provider);
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Cadastro de Novo Ativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['id', 'description', 'amount', 'slices', 'monthsAvailable', 'totalPrice', 'pricePerSlice'].map((field) => (
          <Input
            key={field}
            placeholder={field}
            value={newAsset[field]}
            onChange={(e) => setNewAsset({ ...newAsset, [field]: e.target.value })}
          />
        ))}
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateAsset}>
          Registrar Ativo
        </Button>
      </div>

      <h1 className="text-2xl font-semibold mt-12 mb-4">Ativos Disponíveis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset, index) => (
          <Card key={index} className="shadow-md rounded-2xl border border-gray-200">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-medium">{asset.description}</h2>
              <p className="text-sm text-gray-500">Fornecedor: {asset.supplier}</p>
              <p className="text-sm">Preço por fatia: {ethers.utils.formatUnits(asset.pricePerSlice, 18)} TLC</p>
              <p className="text-sm">Fátias disponíveis: {asset.slices?.toString()}</p>
              <Button onClick={() => handleHire(asset.id)} className="bg-green-600 hover:bg-green-700">
                Contratar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
