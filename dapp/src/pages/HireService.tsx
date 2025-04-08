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
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      }
    }
    async function fetchServiceDetails() {
      try {
        const res = await fetch('http://localhost:3001/api/services');
        const data = await res.json();
        const found = data.find((svc: any) => svc.id === id);
        setService(found);
      } catch (err) {
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    }
    connectWallet();
    fetchServiceDetails();
  }, [id]);

  const handleHire = async () => {
    if (!signer || !id) return;

    try {
      const token = new ethers.Contract(TELECOIN_ADDRESS, TLCAbi.abi, signer);
      const hireS = new ethers.Contract(HIRE_SERVICE_ADDRESS, HireServiceABI.abi, signer);

      const value = ethers.parseUnits("10000", 18);

      // 1. Approve token transfer
      const approveTx = await token.approve(SERVICES_ADDRESS, value);
      await approveTx.wait();

      // 2. Hire service
      const hireSTx = await hireS.hireService(id);
      await hireSTx.wait();
      // 3. Save renter info in backend
      const address = await signer.getAddress();
      await fetch('http://localhost:3001/api/hired-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, renter: address })
      });

      alert('Service successfully hired!');
      setSlices('');
    } catch (err) {
      console.error(err);
      alert('Error hiring the service.');
    }
  };

  return (
    <Container>
      <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
      <Title>Hire Service</Title>

      {loading ? (
        <p>Loading service data...</p>
      ) : service ? (
        <>
          <Label>ID: {service.id}</Label>
          <Label>Description: {service.description}</Label>
          <Label>Available Months: {service.monthsAvailable}</Label>
          <Label>Initial Price: {service.price} TLC</Label>
          <Label>Final Price: {service.finalPrice} TLC</Label>
        </>
      ) : (
        <p>Service not found.</p>
      )}

      <Button onClick={handleHire}>Hire</Button>
    </Container>
  );
}
