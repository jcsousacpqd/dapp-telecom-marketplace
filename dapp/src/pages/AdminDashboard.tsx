import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import HireServiceABI from '@/contracts/HireService.json';
import HireAssetABI from '@/contracts/HireAsset.json';
import ServiceABI from '@/contracts/ServiceContract.json';
import AssetABI from '@/contracts/AssetsContract.json';
import {
  HIRE_SERVICE_ADDRESS,
  HIRE_ASSET_ADDRESS,
} from '@/utils/constants';

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
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

const Section = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Button = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #16a34a;
  }
`;

export default function AdminDashboard() {
  const [signer, setSigner] = useState<any>(null);
  const [serviceDisputes, setServiceDisputes] = useState<any[]>([]);
  const [assetDisputes, setAssetDisputes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);

        const svcRes = await fetch('http://localhost:3001/api/services');
        const svcData = await svcRes.json();
        const hiredRes = await fetch('http://localhost:3001/api/hired-services');
        const hiredData = await hiredRes.json();

        const svcDisputes = hiredData.map((hire: any) => {
          const svcInfo = svcData.find((s: any) => s.id === hire.id);
          if (!svcInfo) return null;
          return {
            id: hire.id,
            renter: hire.renter,
            amount: svcInfo.finalPrice
          };
        }).filter((x: any) => x);

        const assetRes = await fetch('http://localhost:3001/api/assets');
        const assetData = await assetRes.json();
        const hireAssetRes = await fetch('http://localhost:3001/api/hired-assets');
        const hiredAssetsData = await hireAssetRes.json();

        const assetDisputes = hiredAssetsData.map((hire: any) => {
          const assetInfo = assetData.find((a: any) => a.id === hire.assetId);
          if (!assetInfo) return null;
          return {
            id: hire.assetId,
            renter: hire.renter,
            slices: hire.slices,
            totalPrice: assetInfo.totalPrice
          };
        }).filter((x: any) => x);

        setServiceDisputes(svcDisputes.filter((x) => x));
        setAssetDisputes(assetDisputes.filter((x) => x));
      }
    }

    init();
  }, []);

  async function handleServicePayment(serviceId: string, renter: string, amount: string) {
    try {
      const contract = new ethers.Contract(HIRE_SERVICE_ADDRESS, HireServiceABI.abi, signer);
      const tx = await contract.payService(
        serviceId,
        renter,
        ethers.parseEther(amount),
        ethers.parseEther('0')
      );
      await tx.wait();
      alert(`✅ Pagamento do serviço ${serviceId} realizado com sucesso.`);
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao processar o pagamento do serviço.');
    }
  }

  async function handleAssetPayment(assetId: string, renter: string, totalPrice: string) {
    try {
      const contract = new ethers.Contract(HIRE_ASSET_ADDRESS, HireAssetABI.abi, signer);
      const tx = await contract.payAsset(assetId, renter, ethers.parseEther(totalPrice),
        ethers.parseEther('0'));
      await tx.wait();
      alert(`✅ Pagamento do ativo ${assetId} liberado com sucesso.`);
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao processar o pagamento do ativo.');
    }
  }

  return (
    <Container>
      <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
      <Section>
        <Title>🧾 Orquestração de Pagamentos - Serviços</Title>
        {serviceDisputes.map((d, i) => (
          <Card key={i}>
            <p><strong>ID:</strong> {d.id}</p>
            <p><strong>Locatário:</strong> {d.renter}</p>
            <p><strong>Valor Total:</strong> {d.amount} TLC</p>
            <Button onClick={() => handleServicePayment(d.id, d.renter, d.amount)}>
              💸 Efetuar Pagamento
            </Button>
          </Card>
        ))}
      </Section>

      <Section>
        <Title>🏗️ Orquestração de Pagamentos - Ativos</Title>
        {assetDisputes.map((d, i) => (
          <Card key={i}>
            <p><strong>ID:</strong> {d.id}</p>
            <p><strong>Locatário:</strong> {d.renter}</p>
            <p><strong>Slices Contratadas:</strong> {d.slices}</p>
            <p><strong>Valor Total:</strong> {d.totalPrice} TLC</p>
            <Button onClick={() => handleAssetPayment(d.id, d.renter, d.totalPrice)}>
              💸 Liberar Pagamento
            </Button>
          </Card>
        ))}
      </Section>
    </Container>
  );
}