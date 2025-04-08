// src/pages/HireAsset.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import TLCAbi from '@/contracts/Telecoin.json';
import HireAssetABI from '@/contracts/HireAsset.json';
import AssetContract from '@/contracts/AssetsContract.json';
import { TELECOIN_ADDRESS, HIRE_ASSET_ADDRESS, ASSETS_ADDRESS } from '@/utils/constants';

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

export default function HireAssetPage() {
  const { id } = useParams();
  const [slices, setSlices] = useState('');
  const [signer, setSigner] = useState<any>(null);
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      }
    }

    async function fetchAssetDetails() {
      try {
        const res = await fetch('http://localhost:3001/api/assets');
        const data = await res.json();
        const found = data.find((a: any) => a.id === id);
        setAsset(found);
      } catch (err) {
        console.error("Error fetching asset:", err);
      } finally {
        setLoading(false);
      }
    }

    connectWallet();
    fetchAssetDetails();
  }, [id]);

  const handleHire = async () => {
    if (!signer || !id || !slices) return;

    try {
      const token = new ethers.Contract(TELECOIN_ADDRESS, TLCAbi.abi, signer);
      const hire = new ethers.Contract(HIRE_ASSET_ADDRESS, HireAssetABI.abi, signer);

      const value = ethers.parseUnits("100000", 18); // fixed value for now

      // 1. Approve tokens
      const approveTx = await token.approve(ASSETS_ADDRESS, value);
      await approveTx.wait();

      // 2. Hire asset
      const hireTx = await hire.hireAsset(id, parseInt(slices));
      await hireTx.wait();
      const userAddress = await signer.getAddress();

      // Salvar contratação no backend
      await fetch('http://localhost:3001/api/hired-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: id,
          renter: userAddress,
          slices: parseInt(slices)
        })
      });

      alert('Asset successfully hired!');
      setSlices('');
    } catch (err) {
      console.error(err);
      alert('Error hiring asset.');
    }
  };

  return (
    <Container>
      <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
      <Title>Hire Asset</Title>

      {loading ? (
        <p>Loading asset data...</p>
      ) : asset ? (
        <>
          <Label>ID:</Label>
          <p><strong>{asset.id}</strong></p>

          <Label>Description:</Label>
          <p>{asset.description}</p>

          <Label>Total Price:</Label>
          <p>{asset.totalPrice} TLC</p>

          <Label>Available Slices:</Label>
          <p>{asset.slices}</p>

          <Label>Price per Slice:</Label>
          <p>{asset.pricePerSlice} TLC</p>

          <Label>Number of Slices to Hire:</Label>
          <Input
            placeholder="e.g. 2"
            value={slices}
            onChange={(e) => setSlices(e.target.value)}
            type="number"
            min={1}
          />
          <Button onClick={handleHire}>Hire</Button>
        </>
      ) : (
        <p>Asset not found.</p>
      )}
    </Container>
  );
}
