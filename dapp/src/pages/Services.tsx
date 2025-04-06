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
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterButton = styled.button`
  background: #e5e7eb;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;

  &.active {
    background-color: #4f46e5;
    color: white;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const ServiceCard = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 10px;
  background-color: white;
  transition: box-shadow 0.3s;
  position: relative;

  &:hover {
    box-shadow: 0 0 10px #aaa;
  }
`;

const Label = styled.p`
  font-weight: 600;
  margin: 0.2rem 0;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: #4f46e5;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const ActionButton = styled.button`
  background-color: #22c55e;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.4rem; /* distância maior do conteúdo acima */

  &:hover {
    background-color: #16a34a;
  }
`;

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'with-assets' | 'without-assets'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('http://localhost:3001/api/services');
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const getInitials = (name: string) => {
    return name ? name.slice(0, 2).toUpperCase() : '??';
  };

  const filteredServices = services.filter((svc) => {
    if (filter === 'with-assets') return svc.assetIds && svc.assetIds.length > 0;
    if (filter === 'without-assets') return !svc.assetIds || svc.assetIds.length === 0;
    return true;
  });

  const handleHire = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // impede o clique no card
    navigate(`/hire-service/${id}`);
  };

  return (
    <Container>
      <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
      <Title>Serviços Disponíveis</Title>

      <Filters>
        <FilterButton onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Alls</FilterButton>
        <FilterButton onClick={() => setFilter('with-assets')} className={filter === 'with-assets' ? 'active' : ''}>With Asset</FilterButton>
        <FilterButton onClick={() => setFilter('without-assets')} className={filter === 'without-assets' ? 'active' : ''}>Without Assets</FilterButton>
      </Filters>

      {loading && <p>Carregando serviços...</p>}

      <Grid>
        {filteredServices.map((svc, index) => (
          <ServiceCard key={index}>
            <Avatar>{index + 1}</Avatar>
            <Label>ID:</Label> {svc.id}
            <Label>Descrição:</Label> {svc.description}
            <Label>Meses Disponíveis:</Label> {svc.monthsAvailable}
            <Label>Preço Inicial:</Label> {svc.price} TLC
            <Label>Preço Final:</Label> {svc.finalPrice} TLC
            <Label>Confira:</Label>
            <ActionButton onClick={(e) => handleHire(e, svc.id)}>Contratar</ActionButton>
          </ServiceCard>
        ))}
      </Grid>


      {!loading && services.length === 0 && <p>Nenhum serviço encontrado.</p>}
    </Container>
  );
}
