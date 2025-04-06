// src/pages/HireService.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import TLCAbi from '@/contracts/Telecoin.json';
import HireServiceABI from '@/contracts/HireService.json';
import ServiceContract from '@/contracts/ServiceContract.json';
import { TELECOIN_ADDRESS, HIRE_SERVICE_ADDRESS, SERVICES_ADDRESS } from '@/utils/constants';

const Container = styled.div`
  max-width: 500px;
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
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-top: 1rem;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  background: #22c55e;
  color: white;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

export default function HireServicePage() {
  const { id } = useParams();
  const [slices, setSlices] = useState('');
  const [signer, setSigner] = useState<any>(null);
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

  const handleHire = async () => {
    if (!signer || !id) return;

    try {
      const token = new ethers.Contract(TELECOIN_ADDRESS, TLCAbi.abi, signer);
      const hireS = new ethers.Contract(HIRE_SERVICE_ADDRESS, HireServiceABI.abi, signer);
      const Service = new ethers.Contract(SERVICES_ADDRESS, ServiceContract.abi, signer);


      const value = ethers.parseUnits("10000", 18);

      // 1. Aprovação
      const approveTx = await token.approve(SERVICES_ADDRESS, value);
      await approveTx.wait();

      // 2. Contratação
      const hireSTx = await hireS.hireService(id);
      await hireSTx.wait();

      alert('Serviço contratado com sucesso!');
      setSlices('');
    } catch (err) {
      console.error(err);
      alert('Erro ao contratar serviço.');
    }
  };

  return (
    <Container>
      <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
      <Title>Contratar Serviço</Title>
      <Label>ID do Serviço:</Label>
      <p><strong>{id}</strong></p>

      <Button onClick={handleHire}>Contratar</Button>
    </Container>
  );
}
