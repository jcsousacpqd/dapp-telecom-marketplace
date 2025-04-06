import { useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;
  background-color: #f9f9f9;
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
  flex: 1;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px #ddd;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Label = styled.p`
  font-weight: 600;
  margin-top: 1rem;
`;

const Info = styled.code`
  background-color: #f3f3f3;
  padding: 0.5rem;
  border-radius: 6px;
  display: block;
  margin-top: 0.3rem;
  word-break: break-all;
`;

const Button = styled.button`
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #4338ca;
  }
`;

export default function ConnectWallet() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [newWallet, setNewWallet] = useState<{
    address: string;
    privateKey: string;
    mnemonic: string;
  } | null>(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert('MetaMask não encontrada!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setWalletAddress(address);
      setNetworkName(network.name);
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert('Falha ao conectar');
    }
  }

  function createWallet() {
    const wallet = ethers.Wallet.createRandom();
    setNewWallet({
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    });
  }

  function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    alert('Copiado!');
  }

  return (
    <Container>
      <Section>
        <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
        <Title>🔗 Conectar com MetaMask</Title>
        {walletAddress ? (
          <>
            <p>Carteira conectada na rede: <strong>{networkName}</strong></p>
            <Label>Endereço:</Label>
            <Info onClick={() => copyToClipboard(walletAddress)}>{walletAddress}</Info>
            <Button onClick={() => copyToClipboard(walletAddress)}>Copiar Endereço</Button>
          </>
        ) : (
          <Button onClick={connectWallet}>Conectar MetaMask</Button>
        )}
      </Section>
      <Section>
        <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
        <Title>🪪 Não tem uma carteira?</Title>
        <Button onClick={createWallet}>Criar Nova Carteira</Button>

        {newWallet && (
          <>
            <Label>Endereço:</Label>
            <Info>{newWallet.address}</Info>

            <Label>Chave Privada:</Label>
            <Info>{newWallet.privateKey}</Info>

            <Label>Frase Mnemônica:</Label>
            <Info>{newWallet.mnemonic}</Info>

            <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#b91c1c" }}>
              ⚠️ Guarde com segurança! Use na MetaMask clicando em "Importar carteira".
            </p>
          </>
        )}
      </Section>
    </Container>
  );
}
