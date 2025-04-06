import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import ServiceABI from '@/contracts/ServiceContract.json';
import { SERVICES_ADDRESS } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

import SchemaRegistryABI from '@/contracts/SchemaRegistry.json';

import {
  SCHEMA_REGISTRY,
} from '@/utils/constants';


const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px #ddd;
`;


const HomeLink = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  margin-top: 2rem;
  background: #22c55e;
  color: white;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

const RadioGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

export default function PublishService() {
  const [form, setForm] = useState({
    id: '',
    description: '',
    monthsAvailable: '',
    price: '',
    finalPrice: '',
    assetIds: '',
    slices: ''
  });
  const [type, setType] = useState<'infra' | 'market'>('infra');
  const [signer, setSigner] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      }
    }
    connectWallet();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!signer) return alert('Conecte sua carteira.');
      const address = await signer.getAddress();
      const did = `${address.slice(2, 24)}`;
      const schema = `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`

      // 1. Contrato de resolução de Schema
      const SchemaRegistry = new ethers.Contract(SCHEMA_REGISTRY, SchemaRegistryABI.abi, signer);
      const schemaData = await SchemaRegistry.resolveSchema(schema);
      const documentData = schemaData[0];
      console.log(JSON.stringify(documentData))
      const schemaAttrs: string[] = documentData[4];
      const allowedRoles = ["service-provider"];
      const hasPermission = schemaAttrs.some((attr) => allowedRoles.includes(attr));
      // 2. Verificar role permitida
      if (!hasPermission) {
        alert("❌ Permissão negada. Sua identidade não possui o papel necessário para publicar serviços.");
        return;
      }

      // 3. Chamar contrato se passou na verificação
      const contract = new ethers.Contract(SERVICES_ADDRESS, ServiceABI.abi, signer);

      let tx;
      if (type === 'market') {
        const assetIdsArray = form.assetIds.split(',').map((id) => id.trim());
        const slicesArray = form.slices.split(',').map((s) => parseInt(s.trim()));
        tx = await contract.CreateServiceRecordWithAssets(
          form.id,
          assetIdsArray,
          slicesArray,
          form.description,
          parseInt(form.monthsAvailable),
          ethers.parseUnits(form.price, 18),
          ethers.parseUnits(form.finalPrice, 18)
        );
      } else {
        tx = await contract.CreateServiceRecord(
          form.id,
          form.description,
          parseInt(form.monthsAvailable),
          ethers.parseUnits(form.price, 18),
          ethers.parseUnits(form.finalPrice, 18)
        );
      }

      // 4. Salva no backend
      await fetch('http://localhost:3001/api/register-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id,
          description: form.description,
          monthsAvailable: parseInt(form.monthsAvailable),
          price: form.price,
          finalPrice: form.finalPrice,
          assetIds: form.assetIds,
          slices: form.slices
        })
      });

      await tx.wait();
      setStatus('✅ Serviço publicado com sucesso!');
      setForm({ id: '', description: '', monthsAvailable: '', price: '', finalPrice: '', assetIds: '', slices: '' });
    } catch (err) {
      console.error(err);
      setStatus('❌ Erro ao publicar serviço.');
    }
  };


  return (
    <Container>
      <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
      <Title>Publicar Novo Serviço</Title>

      <Label>Tipo de Serviço:</Label>
      <RadioGroup>
        <label>
          <input
            type="radio"
            checked={type === 'infra'}
            onChange={() => setType('infra')}
          />{' '}
          Infraestrutura Própria
        </label>
        <label>
          <input
            type="radio"
            checked={type === 'market'}
            onChange={() => setType('market')}
          />{' '}
          Com Ativos do Marketplace
        </label>
      </RadioGroup>

      {Object.entries(form).map(([key, val]) => {
        if (type === 'infra' && (key === 'assetIds' || key === 'slices')) return null;
        return (
          <div key={key}>
            <Label htmlFor={key}>{key}</Label>
            <Input name={key} value={val} onChange={handleChange} />
          </div>
        );
      })}

      <Button onClick={handleSubmit}>Publicar</Button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </Container>
  );
}
