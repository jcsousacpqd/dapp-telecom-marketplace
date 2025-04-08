
# D-MTS: Decentralized Marketplace for Telecommunication Services

This repository contains a complete demonstration of a decentralized marketplace for telecommunications, integrating smart contracts, self-sovereign identities (DIDs), ERC-20 tokens (Telecoin), and a modern web interface. The system allows identity registration, publication and hiring of assets and services, and B2B payment orchestration.

---

## ⚙️ Requirements

- **OS:** Linux/macOS or WSL (Windows)
- **Node.js:** version ≥ 16 (via NVM recommended)
- **npm**
- **Docker** and **Docker Compose**
- **MetaMask**
- **Operational Besu Blockchain Network**
  - You may use your own local network **or** follow this tutorial:  
    🔗 [besu-production-docker](https://github.com/jeffsonsousa/besu-production-docker)
- **Deployed Smart Contracts** in the network:
  - Use:  
    🔗 [contracts-indy-besu](https://github.com/jeffsonsousa/contracts-indy-besu)  
    🔗 [contracts-telecom-marketplace](https://bitbucket.cpqd.com.br/projects/AERF/repos/contracts-telecom-marketplace/browse)

Once contracts are deployed, extract each contract address and insert it into your environment variables.

---

## Network Setup

### Frontend

```bash
git clone https://github.com/jeffsonsousa/dapp-telecom-marketplace.git
cd dapp-telecom-marketplace
cd dapp/
```

1. Create a `.env.local` file in the root of `dapp/` and add:

```env
VITE_TELECOIN_ADDRESS=0x...
VITE_ASSETS_ADDRESS=0x...
VITE_SERVICES_ADDRESS=0x...
VITE_HIRE_ASSET_ADDRESS=0x...
VITE_HIRE_SERVICE_ADDRESS=0x...
VITE_MARKETPLACE_WALLET_ADDRESS=0x...
VITE_MARKETPLACE_PRIVATE_KEY=0x...
VITE_ETHEREUM_PROVIDER_URL=http://localhost:8545
VITE_INDY_DID_REGISTRY=0x...
VITE_SCHEMA_REGISTRY=0x...
VITE_CREDENTIAL_DEFINITION_REGISTRY=0x...
VITE_REVOCATION_REGISTRY=0x...
```

2. Install dependencies:

```bash
npm install
```

3. Start frontend:

```bash
npm run dev
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

### Backend

```bash
cd server/
```

1. Create a `.env` file with:

```env
MARKETPLACE_PRIVATE_KEY=0x...
TELECOIN_ADDRESS=0x...
ETH_RPC_URL=http://localhost:8545
```

2. Install dependencies:

```bash
npm install
```

3. Start backend:

```bash
node server.js
```

Backend will run at port `3001`, with routes like:

- `GET /api/assets`
- `GET /api/services`
- `POST /api/register-service`

---

## Main Features

The application includes:

- Identity registration (DID + Credential Schema)
- Publishing of assets and services with role-based access
- Token-locked hiring with decentralized orchestration
- Admin Dashboard for B2B payments
- MetaMask integration and off-chain metadata storage

---

## Demo Access

Through the main dashboard, you can:

- Register your identity
- Publish and hire telecom assets
- Publish and hire services
- Access the admin panel for decentralized B2B payments

---

## License

The application uses public smart contracts and open source components. Some contracts and integrations developed by the CPQD team are copyrighted and licensed under the Apache License, Version 2.0.

You can view the full license terms at:  
🔗 [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)