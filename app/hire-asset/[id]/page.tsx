"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Building,
  ArrowLeft,
  Shield,
  Database,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  Layers,
  CheckCircle,
  AlertTriangle,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { apiService } from "@/lib/api"
import { blockchainService } from "@/lib/blockchain"
import { ethers } from "ethers"
import { da } from "date-fns/locale"

interface Asset {
  id: string
  name?: string
  provider?: string
  price: number
  priceUnit?: string
  totalValue?: number
  slices: number
  availableSlices?: number
  location?: string
  image?: string
  features?: string[]
  contractType?: string
  description: string
  specifications?: { [key: string]: string }
}

export default function HireAssetPage() {
  const params = useParams()
  const { id } = useParams();
  // const assetId = params.id as string
  const [signer, setSigner] = useState<any>(null);
  const [asset, setAsset] = useState<any>(null)
  const [loading, setLoading] = useState(true);
  const [selectedSlices, setSelectedSlices] = useState("1")
  const [contractDuration, setContractDuration] = useState("12")
  const [isHiring, setIsHiring] = useState(false)
  const [hiringProgress, setHiringProgress] = useState(0)
  const [status, setStatus] = useState<string>("")

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      }
    }

    async function fetchAssetDetails() {
      try {
        const res = await fetch('http://localhost:3001/api/assets');
        const data = await res.json();
        const found = data.find((a: any) => a.id === id);

        if (found) {
          setAsset({
            ...found,
            price: Number.parseFloat(found.totalPrice), // conversão segura
            pricePerSlice: Number.parseFloat(found.pricePerSlice), // conversão segura
            features: found.features || [],        // evita erro de map em undefined
            specifications: found.specifications || {}, // evita erro em Object.entries
          });
        } else {
          console.warn("Ativo não encontrado com id:", id);
        }
      } catch (err) {
        console.error("Error fetching asset:", err);
      } finally {
        setLoading(false);
      }
    }

    connectWallet();
    fetchAssetDetails();
  }, [id]);

  const calculateTotal = () => {
    if (!asset) return 0
    const slices = Number.parseInt(selectedSlices)
    const months = Number.parseInt(contractDuration)
    return asset.pricePerSlice * slices * months
  }

  const calculateMonthly = () => {
    if (!asset) return 0
    const slices = Number.parseInt(selectedSlices)
    return asset.price * slices
  }

  const handleHire = async () => {
    if (!asset) return

    setIsHiring(true)
    setHiringProgress(0)

    try {
      // Verificar se a carteira está conectada
      setHiringProgress(25)
      if (!blockchainService.isConnected()) {
        await blockchainService.connectWallet()
      }
      const renterAddress = await blockchainService.getConnectedAddress()
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar saldo TLC
      setHiringProgress(50)
      const balance = await blockchainService.getTLCBalance(renterAddress)
      const totalCost = (calculateTotal() + 5).toString()

      if (Number.parseFloat(balance) < Number.parseFloat(totalCost)) {
        throw new Error("Saldo TLC insuficiente")
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Contratar ativo na blockchain e backendassetId
      setHiringProgress(75)
      const result = await apiService.hireAsset(asset, renterAddress, Number.parseInt(selectedSlices), totalCost)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Confirmação final
      setHiringProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStatus(`✅ Ativo contratado com sucesso! TX: ${result.txHash?.slice(0, 10)}...`)
    } catch (err: any) {
      console.error(err)
      setStatus(`❌ Erro ao contratar ativo: ${err.message}`)
    } finally {
      setIsHiring(false)
      setHiringProgress(0)
    }
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/assets">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Contratar Ativo
              </h1>
              <p className="text-sm text-muted-foreground">Configure e confirme sua contratação</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Asset Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{asset.provider}</p>
                      <CardTitle className="text-2xl">{asset.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-purple-600">
                        <Database className="w-3 h-3 mr-1" />
                        Tokenizado
                      </Badge>
                      <Badge className="bg-green-600">
                        <Shield className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <img
                    src={asset.image || "/placeholder.svg"}
                    alt={asset.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-muted-foreground">{asset.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{asset.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{asset.contractType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {asset.slices}/{asset.slices} fatias
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">{asset.price} TLC/mês</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Características</h3>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(asset.features) ? asset.features : []).slice(0, 2).map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Especificações Técnicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(asset.specifications || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hiring Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Configurar Contrato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Este contrato será registrado na blockchain usando smart contracts para garantir transparência e
                      segurança.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="slices">Número de Fatias</Label>
                      <Select value={selectedSlices} onValueChange={setSelectedSlices}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(asset.slices)].map((_, i) => (
                            <SelectItem key={i} value={(i + 1).toString()}>
                              {i + 1} fatia{i > 0 ? "s" : ""} - {asset.price * (i + 1)} TLC/mês
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duração do Contrato</Label>
                      <Select value={contractDuration} onValueChange={setContractDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 meses</SelectItem>
                          <SelectItem value="6">6 meses</SelectItem>
                          <SelectItem value="12">12 meses</SelectItem>
                          <SelectItem value="24">24 meses</SelectItem>
                          <SelectItem value="36">36 meses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-semibold">Resumo Financeiro</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Fatias selecionadas:</span>
                          <span className="font-medium">{selectedSlices}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Preço por fatia:</span>
                          <span className="font-medium">{asset.price} TLC/mês</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Valor mensal:</span>
                          <span className="font-medium">{calculateMonthly()} TLC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Duração:</span>
                          <span className="font-medium">{contractDuration} meses</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Taxa de rede:</span>
                          <span className="font-medium text-green-600">5 TLC</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold">
                          <span>Total do contrato:</span>
                          <span className="text-green-600">{calculateTotal() + 5} TLC</span>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        O valor total será bloqueado em seu saldo e liberado mensalmente conforme o contrato.
                      </AlertDescription>
                    </Alert>

                    {isHiring && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Processando contratação...</span>
                          <span>{hiringProgress}%</span>
                        </div>
                        <Progress value={hiringProgress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {hiringProgress < 25 && "Verificando saldo disponível..."}
                          {hiringProgress >= 25 && hiringProgress < 50 && "Criando contrato inteligente..."}
                          {hiringProgress >= 50 && hiringProgress < 75 && "Bloqueando tokens..."}
                          {hiringProgress >= 75 && "Confirmando na blockchain..."}
                        </div>
                      </div>
                    )}

                    <Button onClick={handleHire} disabled={isHiring} className="w-full h-12 text-lg">
                      {isHiring ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Confirmar e Contratar
                        </>
                      )}
                    </Button>

                    {status && (
                      <Alert className="mb-6">
                        <AlertDescription>{`${status}`}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Termos do Contrato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Pagamentos mensais automatizados via smart contract</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>SLA garantido conforme especificações do ativo</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Suporte técnico 24/7 incluído</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Cancelamento com 30 dias de antecedência</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Reembolso proporcional em caso de indisponibilidade</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
