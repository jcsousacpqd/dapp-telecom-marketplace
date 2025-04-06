import StyledButton from "@/components/Button";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  padding: 4rem;
  background-color: #f9f9f9;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-right: 3rem;
`;

const Content = styled.div`
  flex: 1;
  max-width: 700px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 1rem;
`;

const MenuButton = styled(StyledButton)`
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  border-radius: 8px;
`;

export default function Dashboard() {
  return (
    <Container>
      <Sidebar>
        <Link to="/connect">
          <MenuButton>🔗 Conectar Wallet</MenuButton>
        </Link>

        <Link to="/exchange">
          <MenuButton>💱 Obter TLC</MenuButton>
        </Link>

        <Link to="/assets">
          <MenuButton>🏗️ Ver Ativos</MenuButton>
        </Link>

        <Link to="/services">
          <MenuButton>🛠️ Ver Serviços</MenuButton>
        </Link>

        <Link to="/publish-asset">
          <MenuButton>📝 Publicar Ativo</MenuButton>
        </Link>

        <Link to="/publish-service">
          <MenuButton>📢 Publicar Serviço</MenuButton>
        </Link>

        <Link to="/register">
          <MenuButton>🆔 Cadastrar Identidade</MenuButton>
        </Link>

        <Link to="/admin">
          <MenuButton>⚙️ Painel do Admin</MenuButton>
        </Link>
      </Sidebar>

      <Content>
        <Title>Marketplace de Telecom</Title>
        <Paragraph>
          Bem-vindo ao nosso marketplace descentralizado de infraestrutura de telecomunicações!
        </Paragraph>
        <Paragraph>
          Aqui você pode:
          <ul>
            <li>Tokenizar e alugar ativos físicos de telecomunicações</li>
            <li>Publicar e contratar serviços técnicos ou operacionais</li>
            <li>Gerenciar identidades digitais com segurança usando DIDs</li>
            <li>Visualizar, contratar ou investir em recursos compartilhados</li>
          </ul>
        </Paragraph>
        <Paragraph>
          Tudo com integração à blockchain, identidade auto-soberana e tokens TLC para pagamento e governança.
        </Paragraph>
      </Content>
    </Container>
  );
}
