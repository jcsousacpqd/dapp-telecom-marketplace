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
          <MenuButton>🔗 Connect Wallet</MenuButton>
        </Link>

        <Link to="/register">
          <MenuButton>🆔 Register Profile (DID)</MenuButton>
        </Link>

        <Link to="/exchange">
          <MenuButton>💱 Charge TLC</MenuButton>
        </Link>

        <Link to="/publish-asset">
          <MenuButton>📝 Publish Asset</MenuButton>
        </Link>

        <Link to="/publish-service">
          <MenuButton>📢 Publish Service</MenuButton>
        </Link>

        <Link to="/assets">
          <MenuButton>🏗️ View Assets</MenuButton>
        </Link>

        <Link to="/services">
          <MenuButton>🛠️ View Services</MenuButton>
        </Link>

        <Link to="/admin">
          <MenuButton>⚙️ Admin Panel</MenuButton>
        </Link>
      </Sidebar>

      <Content>
        <Title>Telecom Marketplace</Title>
        <Paragraph>
          Welcome to our decentralized telecommunications infrastructure marketplace!
        </Paragraph>
        <Paragraph>
          Here you can:
          <ul>
            <li>Tokenize and rent physical telecom assets</li>
            <li>Publish and hire technical or operational services</li>
            <li>Manage secure digital identities using DIDs</li>
            <li>View, hire or invest in shared infrastructure</li>
          </ul>
        </Paragraph>
        <Paragraph>
          All integrated with blockchain, self-sovereign identity and TLC tokens for payments and governance.
        </Paragraph>
      </Content>
    </Container>
  );
}
