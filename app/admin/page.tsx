"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { blockchainService } from "@/lib/blockchain"
import { apiService } from "@/lib/api"
import { useParams } from "next/navigation"
import {
  Settings,
  DollarSign,
  Building,
  Server,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Database,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { ethers } from "ethers"

interface ServiceDispute {
  id: string
  renter: string
  amount: string
  description: string
  status: "pending" | "processing" | "completed"
}

interface AssetDispute {
  id: string
  renter: string
  slices: number
  totalPrice: string
  description: string
  status: "pending" | "processing" | "completed"
}

export default function AdminDashboard() {
  const [serviceDisputes, setServiceDisputes] = useState<ServiceDispute[]>([])
  const [assetDisputes, setAssetDisputes] = useState<AssetDispute[]>([])
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const { id } = useParams();
  const [status, setStatus] = useState<string | null>(null)



  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);

        // Buscar serviços e contratações
        const svcRes = await fetch('http://localhost:3001/api/services');
        const svcData = await svcRes.json();
        const hiredRes = await fetch('http://localhost:3001/api/hired-services');
        const hiredData = await hiredRes.json();

        // Checar status real dos serviços
        const svcDisputes = await Promise.all(hiredData.map(async (hire: any) => {
          const svcInfo = svcData.find((s: any) => s.id === hire.id);
          if (!svcInfo) return null;
          // Checa status real no contrato
          try {
            const isOpen = await blockchainService.checkOpenStatus('service', hire.id, hire.renter);
            if (!isOpen) return null;
          } catch (e) {
            return null;
          }
          return {
            id: hire.id,
            renter: hire.renter,
            amount: svcInfo.finalPrice,
            description: svcInfo.description,
            status: 'pending', // status real do contrato
          };
        }));

        // Buscar ativos e contratações
        const assetRes = await fetch('http://localhost:3001/api/assets');
        const assetData = await assetRes.json();
        const hireAssetRes = await fetch('http://localhost:3001/api/hired-assets');
        const hiredAssetsData = await hireAssetRes.json();

        // Checar status real dos ativos
        const assetDisputes = await Promise.all(hiredAssetsData.map(async (hire: any) => {
          const assetInfo = assetData.find((a: any) => a.id === hire.assetId);
          if (!assetInfo) return null;
          // Checa status real no contrato
          try {
            const isOpen = await blockchainService.checkOpenStatus('asset', hire.assetId, hire.renter);
            if (!isOpen) return null;
          } catch (e) {
            return null;
          }
          return {
            id: hire.assetId,
            renter: hire.renter,
            slices: hire.slices,
            totalPrice: assetInfo.totalPrice,
            description: assetInfo.description,
            status: 'pending', // status real do contrato
          };
        }));

        setServiceDisputes(svcDisputes.filter((x: any) => x));
        setAssetDisputes(assetDisputes.filter((x: any) => x));
      }
    }

    init();
  }, []);

  async function handleServicePayment(serviceId: string, renter: string, amount: string) {
    setIsProcessing(serviceId);
    try {
      const result = await apiService.payService(serviceId, renter, amount, '0')

      setServiceDisputes((prev) =>
        prev.map((dispute) => (dispute.id === serviceId ? { ...dispute, status: "completed" } : dispute)),
      );
      setStatus(`✅ Transação realizada com sucesso! TX: ${result.txHash?.slice(0, 10)}...`)
      alert(`✅ Pagamento do serviço ${serviceId} realizado com sucesso.`);

    } catch (err) {
      console.error(err);
      alert('❌ Erro ao processar o pagamento do serviço.');
    } finally {
      setIsProcessing(null);
    }
  }

  async function handleAssetPayment(assetId: string, renter: string, totalPrice: string) {
    setIsProcessing(assetId);
    try {
      const originalPrice = ethers.parseUnits(totalPrice, 18);
      const discount = originalPrice / BigInt(10);
      const discountedPrice = originalPrice - discount;
      const discountedPriceInEther = ethers.formatUnits(discountedPrice, 18);
      console.log('TESTE', discountedPriceInEther)
      const result = await apiService.payAsset(assetId, renter, discountedPriceInEther, '0')

      setAssetDisputes((prev) =>
        prev.map((dispute) => (dispute.id === assetId ? { ...dispute, status: "completed" } : dispute)),
      );
      setStatus(`✅ Transação realizada com sucesso! TX: ${result.txHash?.slice(0, 10)}...`)
      alert(`✅ Pagamento do ativo ${assetId} liberado com sucesso. Valor pago: ${discountedPriceInEther} TLC`);
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao processar o pagamento do ativo.');
    } finally {
      setIsProcessing(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Activity className="w-3 h-3 mr-1" />
            Processando
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        )
      default:
        return null
    }
  }

  const pendingServices = serviceDisputes.filter((d) => d.status === "pending")
  const pendingAssets = assetDisputes.filter((d) => d.status === "pending")
  const totalPendingValue =
    pendingServices.reduce((sum, s) => sum + Number.parseFloat(s.amount), 0) +
    pendingAssets.reduce((sum, a) => sum + Number.parseFloat(a.totalPrice), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Painel Administrativo
              </h1>
              <p className="text-sm text-muted-foreground">Orquestração de Pagamentos e Contratos</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingServices.length + pendingAssets.length}</div>
                <p className="text-xs text-muted-foreground">Aguardando processamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total Pendente</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPendingValue.toLocaleString()} TLC</div>
                <p className="text-xs text-muted-foreground">Em contratos bloqueados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
                <Server className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{serviceDisputes.length}</div>
                <p className="text-xs text-muted-foreground">Contratos de serviços</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ativos Ativos</CardTitle>
                <Building className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assetDisputes.length}</div>
                <p className="text-xs text-muted-foreground">Contratos de ativos</p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              Este painel permite gerenciar pagamentos de contratos inteligentes. Todos os pagamentos são processados
              automaticamente na blockchain.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Orquestração de Serviços ({pendingServices.length})</TabsTrigger>
              <TabsTrigger value="assets">Orquestração de Ativos ({pendingAssets.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Pagamentos de Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceDisputes.map((dispute) => (
                      <Card key={dispute.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{dispute.description}</h4>
                                {getStatusBadge(dispute.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">ID do Serviço:</span>
                                  <p className="font-medium">{dispute.id}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Locatário:</span>
                                  <p className="font-mono text-xs">
                                    {dispute.renter.substring(0, 6)}...
                                    {dispute.renter.substring(dispute.renter.length - 4)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Valor:</span>
                                  <p className="font-bold text-green-600">{dispute.amount} TLC</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {dispute.status === "pending" && (
                                <Button
                                  onClick={() => handleServicePayment(dispute.id, dispute.renter, dispute.amount)}
                                  disabled={isProcessing === dispute.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {isProcessing === dispute.id ? (
                                    <>
                                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                                      Processando...
                                    </>
                                  ) : (
                                    <>
                                      <DollarSign className="w-4 h-4 mr-2" />
                                      Efetuar Pagamento
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {serviceDisputes.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">Nenhum pagamento de serviço pendente</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Pagamentos de Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assetDisputes.map((dispute) => (
                      <Card key={dispute.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{dispute.description}</h4>
                                {getStatusBadge(dispute.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">ID do Ativo:</span>
                                  <p className="font-medium">{dispute.id}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Locatário:</span>
                                  <p className="font-mono text-xs">
                                    {dispute.renter.substring(0, 6)}...
                                    {dispute.renter.substring(dispute.renter.length - 4)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Fatias:</span>
                                  <p className="font-medium">{dispute.slices}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Valor Total:</span>
                                  <p className="font-bold text-green-600">{dispute.totalPrice} TLC</p>
                                </div>
                              </div>
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  Desconto de 10% será aplicado automaticamente no pagamento final.
                                </AlertDescription>
                              </Alert>
                            </div>
                            <div className="flex flex-col gap-2">
                              {dispute.status === "pending" && (
                                <Button
                                  onClick={() => handleAssetPayment(dispute.id, dispute.renter, dispute.totalPrice)}
                                  disabled={isProcessing === dispute.id}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  {isProcessing === dispute.id ? (
                                    <>
                                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                                      Processando...
                                    </>
                                  ) : (
                                    <>
                                      <DollarSign className="w-4 h-4 mr-2" />
                                      Liberar Pagamento
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {assetDisputes.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">Nenhum pagamento de ativo pendente</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
