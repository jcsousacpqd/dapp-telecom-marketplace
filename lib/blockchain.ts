import { ethers } from "ethers"
import { CONTRACTS } from "./contracts"

declare global {
  interface Window {
    ethereum?: any
  }
}

class BlockchainService {
  private provider: ethers.JsonRpcProvider | ethers.BrowserProvider | null = null
  private signer: ethers.Signer | null = null

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error("MetaMask não encontrado")
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum)
      await this.provider.send("eth_requestAccounts", [])
      this.signer = await this.provider.getSigner()
      const address = await this.signer.getAddress()

      // Verificar se está na rede correta (localhost:8545)
      const network = await this.provider.getNetwork()
      console.log("Connected to network:", network.chainId)

      return address
    } catch (error) {
      console.error("Erro ao conectar carteira:", error)
      throw error
    }
  }

  async getTLCBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error("Provider não inicializado")

    const contract = new ethers.Contract(CONTRACTS.TELECOIN.address, CONTRACTS.TELECOIN.abi, this.provider)

    const balance = await contract.balanceOf(address)
    return ethers.formatEther(balance)
  }

  async transferTLC(to: string, amount: string): Promise<string> {
    if (!this.signer) throw new Error("Signer não inicializado")

    const contract = new ethers.Contract(CONTRACTS.TELECOIN.address, CONTRACTS.TELECOIN.abi, this.signer)

    const tx = await contract.transfer(to, ethers.parseEther(amount))
    await tx.wait()
    return tx.hash
  }

  async registerAssetOnChain(
    id: string,
    description: string,
    amount: number,
    slices: number,
    monthsAvailable: number,
    totalPrice: string,
    pricePerSlice: string,
  ): Promise<string> {
    if (!this.signer) throw new Error("Signer não inicializado")

    const contract = new ethers.Contract(CONTRACTS.ASSETS.address, CONTRACTS.ASSETS.abi, this.signer)

    const tx = await contract.CreateAssetsRegistry(
      id,
      description,
      amount,
      slices,
      monthsAvailable,
      ethers.parseEther(totalPrice),
      ethers.parseEther(pricePerSlice),
    )
    await tx.wait()
    return tx.hash
  }

  async registerServiceOnChain(
    id: string,
    description: string,
    monthsAvailable: number,
    price: string,
    assetIds: string,
    slices: string,
    finalPrice: string,
    serviceType: string,

  ): Promise<string> {
    if (!this.signer) throw new Error("Signer não inicializado")

    const contract = new ethers.Contract(CONTRACTS.SERVICES.address, CONTRACTS.SERVICES.abi, this.signer)
    const assetIdsArray = assetIds.split(',').map((id) => id.trim());
    const slicesArray = slices.split(',').map((s) => parseInt(s.trim()));
    console.log(serviceType)
    if (serviceType === 'infra') {
      const tx = await contract.CreateServiceRecord(
        id,
        description,
        monthsAvailable,
        ethers.parseEther(price),
        ethers.parseEther(finalPrice),
      )
      await tx.wait()
      return tx.hash
    }
    if (serviceType === 'market') {
      const tx = await contract.CreateServiceRecordWithAssets(
        id,
        assetIdsArray,
        slicesArray,
        description,
        monthsAvailable,
        ethers.parseEther(price),
        ethers.parseEther(finalPrice),
      )
      await tx.wait()
      return tx.hash
    }
    throw new Error("Tipo de serviço inválido para registro de serviço na blockchain")
  }

  async hireAssetOnChain(assetId: string, slices: number, totalCost: string): Promise<string> {
    if (!this.signer) throw new Error("Signer não inicializado")

    // Primeiro aprovar o gasto de TLC
    const tlcContract = new ethers.Contract(CONTRACTS.TELECOIN.address, CONTRACTS.TELECOIN.abi, this.signer)

    const approveTx = await tlcContract.approve(CONTRACTS.ASSETS.address, ethers.parseEther(totalCost))
    await approveTx.wait()

    // Depois contratar o ativo
    const hireContract = new ethers.Contract(CONTRACTS.HIRE_ASSET.address, CONTRACTS.HIRE_ASSET.abi, this.signer)

    const tx = await hireContract.hireAsset(assetId, slices)
    await tx.wait()
    return tx.hash
  }

  async payService(serviceId: string, renter: string, amount: string): Promise<string> {
    if (!this.signer) {
      await this.connectWallet(); // Garante que 
      // o signer está inicializado
    }
    console.log('TESTE', amount)
    const hireContract = new ethers.Contract(CONTRACTS.HIRE_SERVICE.address, CONTRACTS.HIRE_SERVICE.abi, this.signer);
    const tx = await hireContract.payService(
      serviceId,
      renter,
      ethers.parseEther(amount),
      ethers.parseEther('0')
    );
    await tx.wait();
    return tx.hash;
  }

  async payAsset(assetId: string, renter: string, totalPrice: string): Promise<string> {
    if (!this.signer) {
      await this.connectWallet(); // Garante que o signer está inicializado
    }
    const hireContract = new ethers.Contract(CONTRACTS.HIRE_ASSET.address, CONTRACTS.HIRE_ASSET.abi, this.signer);
    const tx = await hireContract.payAsset(
      assetId,
      renter,
      ethers.parseEther(totalPrice),
      ethers.parseEther('0')
    );
    await tx.wait();
    return tx.hash;
  }

  async hireServiceOnChain(serviceId: string, totalCost: string, requirements: string): Promise<string> {
    if (!this.signer) throw new Error("Signer não inicializado")

    // Primeiro aprovar o gasto de TLC
    const tlcContract = new ethers.Contract(CONTRACTS.TELECOIN.address, CONTRACTS.TELECOIN.abi, this.signer)
    const approveTx = await tlcContract.approve(CONTRACTS.SERVICES.address, ethers.parseEther(totalCost))
    await approveTx.wait()

    // Depois contratar o serviço
    const hireContract = new ethers.Contract(CONTRACTS.HIRE_SERVICE.address, CONTRACTS.HIRE_SERVICE.abi, this.signer)
    console.log(serviceId)
    const tx = await hireContract.hireService(serviceId)
    await tx.wait()
    return tx.hash
  }

  async registerDID(did: string, document: string): Promise<string> {
    if (!this.signer) {
      await this.connectWallet(); // Garante que o signer está inicializado
    }
    const contract = new ethers.Contract(CONTRACTS.DID_REGISTRY.address, CONTRACTS.DID_REGISTRY.abi, this.signer);
    const didDocument = [[], did, [], [["#KEY-1", "Ed25519VerificationKey2018", "controller", "key", ""]], [["#KEY-1", ["1", "1", "1", "1", "1"]]], [], [], [], [], [], []];
    const tx = await contract.createDid(didDocument);
    await tx.wait();
    return tx.hash;
  }

  async registerSchema(fullDid: string, did: string, name: string, role: string): Promise<string> {
    if (!this.signer) {
      await this.connectWallet(); // Garante que o signer está inicializado
    }
    const contract = new ethers.Contract(CONTRACTS.SCHEMA_REGISTRY.address, CONTRACTS.SCHEMA_REGISTRY.abi, this.signer);
    // Criação do Schema
    const schema = [
      `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`,
      fullDid,
      `Mkt${did}`,
      `${did}`,
      [`${name}`, `${role}`]
    ];

    const tx = await contract.createSchema(schema);
    await tx.wait();
    return tx.hash;
  }

  async registerCredDef(fullDid: string, did: string, name: string, role: string): Promise<string> {
    if (!this.signer) {
      await this.connectWallet(); // Garante que o signer está inicializado
    }
    const contract = new ethers.Contract(CONTRACTS.CREDENTIAL_DEFINITION_REGISTRY.address, CONTRACTS.CREDENTIAL_DEFINITION_REGISTRY.abi, this.signer);
    // Re-Criação do Schema
    const schema = [
      `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`,
      fullDid,
      `Mkt${did}`,
      `${did}`,
      [`${name}`, `${role}`]
    ];

    // Criação da Credential Definition
    const credDef = [
      `did:indy2:indy_besu:${did}/anoncreds/v0/CLAIM_DEF/${schema[0]}`,
      fullDid,
      schema[0],
      "CL",
      "BasicIdentity",
      "<keys>"
    ];

    const tx = await contract.createCredentialDefinition(credDef);
    await tx.wait();
    return tx.hash;
  }

  async getDID(did: string): Promise<{ document: string; owner: string; timestamp: number }> {
    if (!this.provider) throw new Error("Provider não inicializado")
    const contract = new ethers.Contract(CONTRACTS.DID_REGISTRY.address, CONTRACTS.DID_REGISTRY.abi, this.provider)

    const [document, owner, timestamp] = await contract.resolveDid(did)
    return { document, owner, timestamp: Number(timestamp) }
  }

  async checkIdentity(fullSchema: string): Promise<string> {
    if (!this.provider) throw new Error("Provider não inicializado")
    const contract = new ethers.Contract(CONTRACTS.SCHEMA_REGISTRY.address, CONTRACTS.SCHEMA_REGISTRY.abi, this.provider)
    console.log(contract)
    const schema = await contract.resolveSchema(fullSchema)
    return schema
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null
  }

  async getConnectedAddress(): Promise<string> {
    if (!this.signer) throw new Error("Signer não inicializado")
    return await this.signer.getAddress()
  }

  /**
   * Checa o status aberto de um serviço ou ativo via contrato.
   * @param type 'service' ou 'asset'
   * @param id ID do serviço ou ativo
   * @param renterAddress endereço do locatário
   * @returns boolean (true se aberto, false caso contrário)
   */
  async checkOpenStatus(type: 'service' | 'asset', id: string, renterAddress: string): Promise<boolean> {
    // Instancia provider dedicado para leitura
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    let contract;
    let fn;
    if (type === 'service') {
      contract = new ethers.Contract(CONTRACTS.SERVICES.address, CONTRACTS.SERVICES.abi, provider);
      fn = 'checkServiceOpenStatus';
    } else if (type === 'asset') {
      contract = new ethers.Contract(CONTRACTS.ASSETS.address, CONTRACTS.ASSETS.abi, provider);
      fn = 'checkOpenStatus';
    } else {
      throw new Error('Tipo inválido para checkOpenStatus');
    }
    try {
      const result = await contract[fn](id, renterAddress);
      return !!result;
    } catch (e) {
      console.error('Erro ao checar status:', e);
      return false;
    }
  }

  async burnTLC(amount: string): Promise<string> {
    if (!this.signer) {
      await this.connectWallet();
    }
    const contract = new ethers.Contract(CONTRACTS.TELECOIN.address, CONTRACTS.TELECOIN.abi, this.signer);
    const tx = await contract.burn(ethers.parseEther(amount));
    await tx.wait();
    return tx.hash;
  }

  async getETHBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error("Provider não inicializado");
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getTotalAssets(): Promise<number> {
    if (!this.provider) throw new Error("Provider não inicializado");
    const contract = new ethers.Contract(CONTRACTS.ASSETS.address, CONTRACTS.ASSETS.abi, this.provider);
    // Supondo que há um método getAllAssets que retorna array de ids
    const ids: string[] = await contract.getAllAssets();
    return ids.length;
  }

  async getTotalServices(): Promise<number> {
    if (!this.provider) throw new Error("Provider não inicializado");
    const contract = new ethers.Contract(CONTRACTS.SERVICES.address, CONTRACTS.SERVICES.abi, this.provider);
    // Supondo que há um método getAllServices que retorna array de ids
    const ids: string[] = await contract.getAllServices();
    return ids.length;
  }

  async getTLCVolume(): Promise<string> {
    await this.ensureProvider();
    if (!this.provider) throw new Error("Provider não inicializado")
    const contract = new ethers.Contract(CONTRACTS.TELECOIN.address, CONTRACTS.TELECOIN.abi, this.provider);
    const supply = await contract.totalSupply();
    console.log("supply", supply)
    return ethers.formatEther(supply);
  }

  async getTotalContracts(): Promise<number> {
    if (!this.provider) throw new Error("Provider não inicializado");
    // Exemplo: contar eventos AssetHired + ServiceHired
    const assetContract = new ethers.Contract(CONTRACTS.ASSETS.address, CONTRACTS.ASSETS.abi, this.provider);
    const serviceContract = new ethers.Contract(CONTRACTS.SERVICES.address, CONTRACTS.SERVICES.abi, this.provider);
    const assetEvents = await assetContract.queryFilter(assetContract.filters.AssetHired());
    const serviceEvents = await serviceContract.queryFilter(serviceContract.filters.ServiceHired());
    return assetEvents.length + serviceEvents.length;
  }

  public async ensureProvider() {
    if (!this.provider) {
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545");
      }
    }
  }
}

export const blockchainService = new BlockchainService()
