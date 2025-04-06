import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
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
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AssetCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Label = styled.p`
  font-weight: 600;
  margin: 0.2rem 0;
  color: #222;
`;

const Value = styled.p`
  margin: 0 0 0.5rem;
  color: #555;
`;

const HireButton = styled.button`
  margin-top: 1rem;
  background-color: #22c55e;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #16a34a;
  }
`;

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch('http://localhost:3001/api/assets');
        const data = await res.json();
        setAssets(data);
      } catch (err) {
        console.error("Erro ao buscar ativos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, []);

  const handleHire = (id: string) => {
    navigate(`/hire-asset/${id}`);
  };

  return (
    <Container>
      <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
      <Title>Ativos Disponíveis</Title>

      {loading && <p>Carregando ativos...</p>}

      <Grid>
        {assets.map((asset, index) => (
          <AssetCard key={index}>
            <Label>ID:</Label> <Value>{asset.id}</Value>
            <Label>Descrição:</Label> <Value>{asset.description}</Value>
            <Label>Fornecedor:</Label> <Value>{asset.supplier}</Value>
            <Label>Disponíveis:</Label> <Value>{asset.amount}</Value>
            <Label>Slices:</Label> <Value>{asset.slices}</Value>
            <Label>Preço Total:</Label> <Value>{asset.totalPrice} TLC</Value>
            <Label>Preço por Fatia:</Label> <Value>{asset.pricePerSlice} TLC</Value>
            <Label>Meses Disponíveis:</Label> <Value>{asset.monthsAvailable}</Value>

            <HireButton onClick={() => handleHire(asset.id)}>
              📦 Contratar Ativo
            </HireButton>
          </AssetCard>
        ))}
      </Grid>

      {!loading && assets.length === 0 && <p>Nenhum ativo encontrado.</p>}
    </Container>
  );
}
