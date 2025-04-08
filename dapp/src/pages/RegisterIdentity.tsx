import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

import IndyDidRegistryABI from '@/contracts/IndyDidRegistry.json';
import SchemaRegistryABI from '@/contracts/SchemaRegistry.json';
import CredentialDefinitionRegistryABI from '@/contracts/CredentialDefinitionRegistry.json';

import {
  INDY_DID_REGISTRY,
  SCHEMA_REGISTRY,
  CREDENTIAL_DEFINITION_REGISTRY
} from '@/utils/constants';

const Wrapper = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
`;

const Container = styled.div`
  flex: 1;
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

const Select = styled.select`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  margin-top: 2rem;
  background: #4f46e5;
  color: white;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

export default function RegisterIdentity() {
  const [form, setForm] = useState({ name: '', role: '' });
  const [status, setStatus] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      if (!window.ethereum) return alert('Wallet não detectada');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const didRegistry = new ethers.Contract(INDY_DID_REGISTRY, IndyDidRegistryABI.abi, signer);
      const did = `${address.slice(2, 24)}`;
      const fullDid = `did:indy2:indy_besu:${did}`;

      let alreadyRegistered = false;

      try {
        const result = await didRegistry.resolveDid(fullDid);
        alreadyRegistered = result[1] !== ethers.ZeroAddress;
      } catch {
        console.warn(`DID ${fullDid} não encontrado.`);
      }

      if (alreadyRegistered) {
        setStatus(`⚠️ Identidade já registrada com o DID: ${fullDid}`);
        return;
      }

      const document = [[], fullDid, [], [["#KEY-1", "Ed25519VerificationKey2018", "controller", "key", ""]], [["#KEY-1", ["1", "1", "1", "1", "1"]]], [], [], [], [], [], []];
      const didTx = await didRegistry.createDid(document);
      await didTx.wait();

      const schema = [
        `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`,
        fullDid,
        `Mkt${did}`,
        `${did}`,
        [`${form.name}`, `${form.role}`]
      ];

      const schemaRegistry = new ethers.Contract(SCHEMA_REGISTRY, SchemaRegistryABI.abi, signer);
      const schemaTx = await schemaRegistry.createSchema(schema);
      await schemaTx.wait();

      const credDef = [
        `did:indy2:indy_besu:${did}/anoncreds/v0/CLAIM_DEF/${schema[0]}`,
        fullDid,
        schema[0],
        "CL",
        "BasicIdentity",
        "<keys>"
      ];

      const credDefRegistry = new ethers.Contract(CREDENTIAL_DEFINITION_REGISTRY, CredentialDefinitionRegistryABI.abi, signer);
      const credTx = await credDefRegistry.createCredentialDefinition(credDef);
      await credTx.wait();

      setStatus(`✅ Identidade registrada com sucesso! DID: ${did}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro ao registrar identidade.");
    }
  };

  const handleCheckIdentity = async () => {
    try {
      if (!window.ethereum) return alert('Wallet não detectada');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const did = `${address.slice(2, 24)}`;
      const fullSchema = `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`;
      const schemaRegistry = new ethers.Contract(SCHEMA_REGISTRY, SchemaRegistryABI.abi, signer);
      const result = await schemaRegistry.resolveSchema(fullSchema);
      const attrs = result[0][4]; // name, role
      setQueryResult(`👤 Nome: ${attrs[0]} | 📛 Perfil: ${attrs[1]}`);
    } catch (err) {
      console.error(err);
      setQueryResult("❌ Nenhuma identidade encontrada para esta carteira.");
    }
  };

  return (
    <Wrapper>
      <Container>
        <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
        <Title>Register Identity</Title>

        <Label>Full Name</Label>
        <Input name="name" onChange={handleChange} />

        <Label>Profile Type</Label>
        <Select name="role" onChange={handleChange}>
          <option value="">Select...</option>
          <option value="asset-provider">Asset Provider</option>
          <option value="service-provider">Service Provider</option>
          <option value="client">Client</option>
        </Select>

        <Button onClick={handleRegister}>Create Identity</Button>

        {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
      </Container>

      <Container>
        <Title>Check Identity</Title>
        <p>Use your wallet to check which profile is associated with your DID.</p>
        <Button onClick={handleCheckIdentity}>🔍 Check My Identity</Button>
        {queryResult && <p style={{ marginTop: '1rem' }}>{queryResult}</p>}
      </Container>
    </Wrapper>
  );
}
