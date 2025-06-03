"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Server,
  ArrowLeft,
  Shield,
  Database,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Lock,
  Clock,
  Building,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { apiService } from "@/lib/api"
import { blockchainService } from "@/lib/blockchain"
import { ethers } from "ethers"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Service {
  id: string
  name: string
  provider: string
  price: number
  finalPrice: number
  priceUnit: string
  duration: string
  location: string
  image: string
  features: string[]
  requiredAssets?: string[]
  contractType: string
  description: string
  slaLevel: string
  specifications: { [key: string]: string }
}

export default function HireServicePage() {
  const params = useParams()
  const { id } = useParams();
  const [signer, setSigner] = useState<any>(null);
  const [service, setService] = useState<Service | null>(null)
  const [contractDuration, setContractDuration] = useState("12")
  const [contractDurations, setContractDurations] = useState<number[]>([])
  const [customRequirements, setCustomRequirements] = useState("")
  const [loading, setLoading] = useState(true);
  const [isHiring, setIsHiring] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [hiringProgress, setHiringProgress] = useState(0)
  const [status, setStatus] = useState<string | null>(null)

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
        const res = await fetch('http://localhost:3001/api/services');
        const data = await res.json();
        const found = data.find((a: any) => a.id === id);

        if (found) {
          setService({
            ...found,
            price: Number.parseFloat(found.price), // conversão segura
            finalPrice: Number.parseFloat(found.finalPrice), // conversão segura
            features: found.features || [],        // evita erro de map em undefined
            specifications: found.specifications || {}, // evita erro em Object.entries
          });
          // Se o serviço tem duration no formato '12 months', use para gerar as opções
          if (found.duration && typeof found.duration === 'string') {
            const match = found.duration.match(/(\d+)/);
            const maxMonths = match ? Number(match[1]) : 12;
            if (maxMonths > 0) {
              setContractDurations(Array.from({ length: maxMonths }, (_, i) => i + 1));
            }
          }
        } else {
          console.warn("Serviço não encontrado com id:", id);
        }
      } catch (err: unknown) {
        let msg = '';
        if (err instanceof Error) {
          msg = err.message;
          console.error(err);
        } else {
          msg = String(err);
          console.error(msg);
        }
        setStatus(`❌ Erro ao contratar serviço: ${msg}`)
      } finally {
        setLoading(false);
      }
    }

    connectWallet();
    fetchAssetDetails();
  }, [id]);

  const calculateTotal = () => {
    if (!service) return 0
    const months = Number.parseInt(contractDuration)
    // O valor total nunca pode ser maior que o finalPrice do serviço
    return service.finalPrice
  }

  const calculateFee = () => {
    if (!service) return 0
    // Taxa de 10% do valor total
    return (service.finalPrice * 0.1).toFixed(2)
  }

  const calculateMonthly = () => {
    if (!service) return 0
    const months = Number.parseInt(contractDuration)
    if (months <= 0) return 0
    // Valor mensal = (total - taxa) dividido pelo número de meses
    const totalSemTaxa = service.finalPrice - Number(calculateFee())
    return (totalSemTaxa / months).toFixed(2)
  }

  const handleHire = async () => {
    if (!service) return

    setIsHiring(true)
    setHiringProgress(0)

    try {
      // Verificar se a carteira está conectada
      setHiringProgress(20)
      if (!blockchainService.isConnected()) {
        await blockchainService.connectWallet()
      }
      const renterAddress = await blockchainService.getConnectedAddress()
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar saldo TLC
      setHiringProgress(40)
      const balance = await blockchainService.getTLCBalance(renterAddress)
      const totalCost = (calculateTotal()).toString()

      if (Number.parseFloat(balance) < Number.parseFloat(totalCost)) {
        throw new Error("Saldo TLC insuficiente")
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar ativos necessários (simulado)
      setHiringProgress(60)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Contratar serviço na blockchain e backend
      setHiringProgress(80)
      const result = await apiService.hireService(service.id, renterAddress, totalCost, customRequirements)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Confirmação final
      setHiringProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStatus(`✅ Serviço contratado com sucesso! TX: ${result.txHash?.slice(0, 10)}...`)
    } catch (err) {
      console.error(err)
      setStatus(`❌ Erro ao contratar serviço: ${err.message}`)
    } finally {
      setIsHiring(false)
      setHiringProgress(0)
    }
  }

  if (!service) {
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
            <Link href="/services">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                Contratar Serviço
              </h1>
              <p className="text-sm text-muted-foreground">Configure e confirme sua contratação</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{service.provider}</p>
                      <CardTitle className="text-2xl">{service.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-purple-600">
                        <Database className="w-3 h-3 mr-1" />
                        Tokenizado
                      </Badge>
                      <Badge className="bg-green-600">
                        <Shield className="w-3 h-3 mr-1" />
                        SLA {service.slaLevel}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{service.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{service.contractType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">{service.finalPrice} TLC</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Características</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {service.requiredAssets && (
                    <div>
                      <h3 className="font-semibold mb-2">Ativos Necessários</h3>
                      <div className="space-y-2">
                        {service.requiredAssets.map((asset, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <Building className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{asset}</span>
                            <Badge variant="outline" className="ml-auto text-green-600">
                              Disponível
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-2">Especificações Técnicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(service.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{value}</span>
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
                      <Label htmlFor="duration">Duração do Contrato</Label>
                      <Select value={contractDuration} onValueChange={setContractDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(contractDurations) && contractDurations.length > 0 ? (
                            contractDurations.map((months) => (
                              <SelectItem key={months} value={String(months)}>{months} meses</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="12">12 meses</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requisitos Personalizados (Opcional)</Label>
                      <Input
                        id="requirements"
                        placeholder="Descreva requisitos específicos..."
                        value={customRequirements}
                        onChange={(e) => setCustomRequirements(e.target.value)}
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                      {/* Resumo Financeiro removido da visualização principal */}
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
                          {hiringProgress < 20 && "Verificando saldo disponível..."}
                          {hiringProgress >= 20 && hiringProgress < 40 && "Verificando ativos necessários..."}
                          {hiringProgress >= 40 && hiringProgress < 60 && "Criando contrato inteligente..."}
                          {hiringProgress >= 60 && hiringProgress < 80 && "Bloqueando tokens..."}
                          {hiringProgress >= 80 && "Confirmando na blockchain..."}
                        </div>
                      </div>
                    )}

                    <Button onClick={() => setShowConfirmDialog(true)} disabled={isHiring} className="w-full h-12 text-lg">
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
                      <Alert
                        className={status.includes("✅") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                      >
                        <AlertDescription>{status}</AlertDescription>
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
                      <span>SLA {service.slaLevel} garantido com compensação automática</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Suporte técnico 24/7 incluído</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Monitoramento em tempo real</span>
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

      {/* Dialog de confirmação do resumo financeiro */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resumo Financeiro</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor mensal:</span>
              <span className="font-medium">{calculateMonthly()} TLC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duração:</span>
              <span className="font-medium">{contractDuration} meses</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taxa de rede (10%):</span>
              <span className="font-medium text-green-600">{calculateFee()} TLC</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total do contrato:</span>
              <span className="text-green-600">{calculateTotal()} TLC</span>
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-4 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                setShowConfirmDialog(false);
                await handleHire();
              }}
              disabled={isHiring}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Sim, confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
