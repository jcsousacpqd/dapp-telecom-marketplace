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

const Container = styled.div`
  max-width: 600px;
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
      console.log(fullDid)
      let alreadyRegistered = false;

      try {
        const result = await didRegistry.resolveDid(fullDid);
        alreadyRegistered = result[1] !== ethers.ZeroAddress;
      } catch (err) {
        console.warn(`DID ${fullDid} não encontrado. Continuando registro.`);
      }

      if (alreadyRegistered) {
        setStatus(`⚠️ Identidade já registrada com o DID: ${fullDid} Faça login com uma carteira diferente!`);
        return;
      }

      const document = [[], `did:indy2:indy_besu:${did}`, [], [["did:indy2:indy_besu:RQDxoJ2Mz3WuyqaqsjVTdN#KEY-1", "Ed25519VerificationKey2018", "did:indy2:testnet:N22WedHLJdFf4yMaDXdhJcL97", "HAFkhqbPbor781QCMfNvr6oQTTixK9U7gZmDV7pszTHp", ""]], [["did:indy2:indy_besu:RQDxoJ2Mz3WuyqaqsjVTdN#KEY-1", ["1", "1", "1", "1", "1"]]], [], [], [], [], [], []];

      const didTx = await didRegistry.createDid(document);
      await didTx.wait();

      const schema = [
        `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`,
        `did:indy2:indy_besu:${did}`,
        `Mkt${did}`,
        `${did}`,
        [`${form.name}`, `${form.role}`]
      ];
      console.log(schema)
      const schemaRegistry = new ethers.Contract(SCHEMA_REGISTRY, SchemaRegistryABI.abi, signer);
      const schemaTx = await schemaRegistry.createSchema(schema);
      await schemaTx.wait();
      const credDef = [`did:indy2:indy_besu:${did}/anoncreds/v0/CLAIM_DEF/did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/BasicIdentity/1.0.0/${did}`, `did:indy2:indy_besu:${did}`, `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`, "CL", "BasicIdentity", "<keys>"];
      console.log(credDef)
      const credDefRegistry = new ethers.Contract(CREDENTIAL_DEFINITION_REGISTRY, CredentialDefinitionRegistryABI.abi, signer);
      const credTx = await credDefRegistry.createCredentialDefinition(credDef);
      await credTx.wait();

      setStatus(`✅ Identidade registrada com sucesso! DID: ${did}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro ao registrar identidade.");
    }
  };

  return (
    <Container>
      <HomeLink onClick={() => navigate('/')}>🏠 Home</HomeLink>
      <Title>Cadastrar Identidade</Title>

      <Label>Nome Completo</Label>
      <Input name="name" onChange={handleChange} />

      <Label>Tipo de Perfil</Label>
      <Select name="role" onChange={handleChange}>
        <option value="">Selecione...</option>
        <option value="asset-provider">Fornecedor de Ativo</option>
        <option value="service-provider">Fornecedor de Serviço</option>
        <option value="client">Cliente</option>
      </Select>

      <Button onClick={handleRegister}>Criar Identidade</Button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </Container>
  );
}
