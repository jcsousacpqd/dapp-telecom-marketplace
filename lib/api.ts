const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

import { blockchainService } from "./blockchain"

export interface Asset {
  id: string
  description: string
  amount: number
  slices: number
  monthsAvailable: number
  totalPrice: string
  pricePerSlice: string
  owner?: string
  txHash?: string
}

export interface Service {
  id: string
  description: string
  monthsAvailable: number
  price: string
  finalPrice: string
  assetIds: string
  slices: string
  owner?: string
  txHash?: string
  serviceType: string
}

export interface HiredAsset {
  assetId: string
  renter: string
  slices: number
  txHash?: string
}

export interface HiredService {
  id: string
  renter: string
  requirements?: string
  txHash?: string
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Assets
  async registerAsset(asset: any): Promise<{ message: string; txHash?: string }> {
    try {
      // 1. Registrar na blockchain
      const txHash = await blockchainService.registerAssetOnChain(
        asset.id,
        asset.description,
        asset.amount,
        asset.slices,
        asset.monthsAvailable,
        asset.totalPrice,
        asset.pricePerSlice,
      )

      // 2. Registrar no backend
      const result = await this.request<{ message: string }>("/api/register-asset", {
        method: "POST",
        body: JSON.stringify({ ...asset, txHash }),
      })

      return { ...result, txHash }
    } catch (error) {
      console.error("Erro ao registrar ativo:", error)
      throw error
    }
  }

  async getAssets(): Promise<Asset[]> {
    return this.request<Asset[]>("/api/assets")
  }

  // Services
  async registerService(service: any): Promise<{ message: string; txHash?: string }> {
    try {
      // 1. Registrar na blockchain
      const txHash = await blockchainService.registerServiceOnChain(
        service.id,
        service.description,
        service.monthsAvailable,
        service.price,
        service.assetIds,
        service.slices,
        service.finalPrice,
        service.serviceType,
      )

      // 2. Registrar no backend
      const result = await this.request<{ message: string }>("/api/register-service", {
        method: "POST",
        body: JSON.stringify({ ...service, txHash }),
      })

      return { ...result, txHash }
    } catch (error) {
      console.error("Erro ao registrar serviço:", error)
      throw error
    }
  }

  async getServices(): Promise<Service[]> {
    return this.request<Service[]>("/api/services")
  }

  // Hiring
  async hireAsset(
    asset: any,
    renter: string,
    slices: number,
    totalCost: string,
  ): Promise<{ message: string; txHash?: string }> {
    try {
      // 1. Contratar na blockchain
      const txHash = await blockchainService.hireAssetOnChain(asset.id, slices, totalCost)

      // 2. Registrar no backend com todos os campos do ativo
      const result = await this.request<{ message: string }>("/api/hired-asset", {
        method: "POST",
        body: JSON.stringify({
          ...asset,
          renter,
          slices,
          txHash,
        }),
      })

      return { ...result, txHash }
    } catch (error) {
      console.error("Erro ao contratar ativo:", error)
      throw error
    }
  }

  async hireService(
    serviceId: string,
    renter: string,
    totalCost: string,
    requirements?: string,
  ): Promise<{ message: string; txHash?: string }> {
    try {
      // 1. Contratar na blockchain
      const txHash = await blockchainService.hireServiceOnChain(serviceId, totalCost, requirements || "")

      // 2. Registrar no backend
      const result = await this.request<{ message: string }>("/api/hired-services", {
        method: "POST",
        body: JSON.stringify({ id: serviceId, renter, requirements, txHash }),
      })

      return { ...result, txHash }
    } catch (error) {
      console.error("Erro ao contratar serviço:", error)
      throw error
    }
  }


  async payService(
    serviceId: string,
    renter: string,
    totalCost: string,
    requirements?: string,
  ): Promise<{ message: string; txHash?: string }> {
    try {
      // Efetuar pagamento do serviço
      const txHash = await blockchainService.payService(serviceId, renter, totalCost)
      return { message: "Serviço pago com sucesso", txHash }
    } catch (error) {
      console.error("Erro ao liberar serviço:", error)
      throw error
    }
  }

  async payAsset(
    assetId: string,
    renter: string,
    totalCost: string,
    requirements?: string,
  ): Promise<{ message: string; txHash?: string }> {
    try {
      // Efetuar pagamento do serviço
      const txHash = await blockchainService.payAsset(assetId, renter, totalCost)
      return { message: "Ativo pago com sucesso", txHash }
    } catch (error) {
      console.error("Erro ao liberar ativo:", error)
      throw error
    }
  }

  async getHiredAssets(): Promise<HiredAsset[]> {
    return this.request<HiredAsset[]>("/api/hired-assets")
  }

  async getHiredServices(): Promise<HiredService[]> {
    return this.request<HiredService[]>("/api/hired-services")
  }

  // TLC Token
  async mintTLC(to: string, amount: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>("/mint", {
      method: "POST",
      body: JSON.stringify({ to, amount }),
    })
  }

  // TLC Token
  async burnTLC(amount: string): Promise<{ success: boolean; message: string; txHash?: string }> {
    try {
      const txHash = await blockchainService.burnTLC(amount);
      return { success: true, message: 'TLC queimado com sucesso', txHash };
    } catch (error) {
      console.error('Erro ao queimar TLC:', error);
      return { success: false, message: 'Erro ao queimar TLC' };
    }
  }


  // DID Identity
  async registerDID(did: string, document: any): Promise<{ message: string; txHash?: string }> {
    try {
      const txHash = await blockchainService.registerDID(did, JSON.stringify(document))
      return { message: "DID registrado com sucesso na blockchain", txHash }
    } catch (error) {
      console.error("Erro ao registrar DID:", error)
      throw error
    }
  }

  async getDID(did: string): Promise<{ document: string; owner: string; timestamp: number }> {
    return blockchainService.getDID(did)
  }
}

export const apiService = new ApiService()
