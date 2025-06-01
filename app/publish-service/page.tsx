"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Server,
  ArrowLeft,
  Shield,
  Database,
  Loader2,
  Info,
  DollarSign,
  Calendar,
  Building,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api"
import { blockchainService } from "@/lib/blockchain"
import { ethers } from "ethers"

interface ServiceForm {
  id: string
  name: string
  type: string
  category: string
  provider: string
  price: string
  priceUnit: string
  duration: string
  location: string
  image: string
  features: string
  requiredAssets: string
  contractType: string
  tokenized: boolean
  slaLevel: string
  description: string
  monthsAvailable: string
  finalPrice: string
  assetIds: string
  slices: string
  serviceType: string
}

export default function PublishService() {
  const [form, setForm] = useState<ServiceForm>({
    id: "",
    name: "",
    type: "service",
    category: "network",
    provider: "",
    price: "",
    priceUnit: "month",
    duration: "12 months",
    location: "",
    image: "/placeholder.svg?height=300&width=300",
    features: "",
    requiredAssets: "",
    contractType: "SLA Standard",
    tokenized: true,
    slaLevel: "99.9%",
    description: "",
    monthsAvailable: "",
    finalPrice: "",
    assetIds: "",
    slices: "",
    serviceType: "",
  })
  const [serviceType, setServiceType] = useState<"infra" | "market">("infra")
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishProgress, setPublishProgress] = useState(0)
  const [status, setStatus] = useState<string | null>(null)
  const [userRoleChecked, setUserRoleChecked] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {

    async function checkUserRole() {
      try {
        if (!window.ethereum) return alert('Wallet não detectada');
        await blockchainService.ensureProvider();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const did = `${address.slice(2, 24)}`;
        const fullSchema = `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`;
        console.log(fullSchema)
        const schemaVerify = await blockchainService.checkIdentity(fullSchema)
        const attrs = schemaVerify[0][4]; // name, role
        const schemaData = await blockchainService.checkIdentity(fullSchema)
        // Trata retorno conforme instrução do usuário
        const documentData = schemaData[0] || schemaData
        let schemaAttrs: string[] = [];
        if (Array.isArray(documentData[4])) {
          schemaAttrs = documentData[4] as string[];
        } else if (typeof documentData[4] === 'string') {
          schemaAttrs = [documentData[4]];
        }
        const allowedRoles = ["service-provider"]
        const permission = schemaAttrs.some((attr) => allowedRoles.includes(attr))
        setHasPermission(permission)
      } catch (err) {
        setHasPermission(false)
      } finally {
        setUserRoleChecked(true)
      }
    }
    checkUserRole()
  }, [])

  const handleChange = (field: keyof ServiceForm, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const validateForm = () => {
    const requiredFields = ["id", "description", "monthsAvailable", "price", "finalPrice"]
    const isValid = requiredFields.every((field) => String(form[field as keyof ServiceForm]).trim() !== "")

    if (serviceType === "market") {
      return isValid && String(form.assetIds).trim() !== "" && String(form.slices).trim() !== ""
    }
    return isValid
  }

  const handleSubmit = async () => {
    if (!userRoleChecked) {
      alert("Aguarde a verificação de identidade...")
      return
    }
    if (!hasPermission) {
      alert("❌ Permissão negada. Sua identidade não possui o papel necessário para publicar serviços.")
      return
    }
    if (!validateForm()) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsPublishing(true)
    setPublishProgress(0)

    try {
      // Verificar se a carteira está conectada
      setPublishProgress(25)
      if (!blockchainService.isConnected()) {
        await blockchainService.connectWallet()
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Registrar serviço na blockchain e backend
      setPublishProgress(50)
      const result = await apiService.registerService({
        id: form.id,
        name: form.name,
        type: form.type,
        category: form.category,
        provider: form.provider,
        price: form.price,
        priceUnit: form.priceUnit,
        duration: form.duration,
        location: form.location,
        image: form.image,
        features: form.features.split(',').map(f => f.trim()),
        requiredAssets: form.requiredAssets.split(',').map(f => f.trim()),
        contractType: form.contractType,
        tokenized: form.tokenized,
        slaLevel: form.slaLevel,
        description: form.description,
        monthsAvailable: Number.parseInt(form.monthsAvailable),
        finalPrice: form.finalPrice,
        assetIds: form.assetIds,
        slices: form.slices,
        serviceType: serviceType,
      })

      setPublishProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Confirmação final
      setPublishProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStatus(`✅ Serviço publicado com sucesso! TX: ${result.txHash?.slice(0, 10)}...`)
      setForm({
        id: "",
        name: "",
        type: "service",
        category: "network",
        provider: "",
        price: "",
        priceUnit: "month",
        duration: "12 months",
        location: "",
        image: "/placeholder.svg?height=300&width=300",
        features: "",
        requiredAssets: "",
        contractType: "SLA Standard",
        tokenized: true,
        slaLevel: "99.9%",
        description: "",
        monthsAvailable: "",
        finalPrice: "",
        assetIds: "",
        slices: "",
        serviceType: "",
      })
    } catch (err) {
      console.error(err)
      setStatus("❌ Erro ao publicar serviço.")
    } finally {
      setIsPublishing(false)
      setPublishProgress(0)
    }
  }

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
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                Publicar Serviço
              </h1>
              <p className="text-sm text-muted-foreground">Ofereça serviços de telecomunicações</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Tipo de Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Escolha se o serviço usa sua própria infraestrutura ou ativos do marketplace.
                    </AlertDescription>
                  </Alert>

                  <RadioGroup
                    value={serviceType}
                    onValueChange={(value) => setServiceType(value as "infra" | "market")}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="infra" id="infra" />
                        <div className="flex-1">
                          <Label htmlFor="infra" className="font-medium">
                            Infraestrutura Própria
                          </Label>
                          <p className="text-sm text-muted-foreground">Use seus próprios ativos e equipamentos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="market" id="market" />
                        <div className="flex-1">
                          <Label htmlFor="market" className="font-medium">
                            Com Ativos do Marketplace
                          </Label>
                          <p className="text-sm text-muted-foreground">Utilize ativos disponíveis no marketplace</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Informações do Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="id">
                        ID do Serviço <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="id"
                        placeholder="ex: 5G-NETWORK-001"
                        value={form.id}
                        onChange={(e) => handleChange("id", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthsAvailable">
                        Meses Disponíveis <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="monthsAvailable"
                        type="number"
                        placeholder="ex: 12"
                        value={form.monthsAvailable}
                        onChange={(e) => handleChange("monthsAvailable", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Descrição do Serviço <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva detalhadamente seu serviço de telecomunicações..."
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      disabled={isPublishing}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Preço Inicial (TLC) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="ex: 5000"
                        value={form.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="finalPrice">
                        Preço Final (TLC) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="finalPrice"
                        type="number"
                        placeholder="ex: 8500"
                        value={form.finalPrice}
                        onChange={(e) => handleChange("finalPrice", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                  </div>

                  {serviceType === "market" && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Ativos do Marketplace
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="assetIds">
                            IDs dos Ativos <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="assetIds"
                            placeholder="ex: TOWER-001, ANTENNA-002"
                            value={form.assetIds}
                            onChange={(e) => handleChange("assetIds", e.target.value)}
                            disabled={isPublishing}
                          />
                          <p className="text-xs text-muted-foreground">Separe múltiplos IDs com vírgula</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slices">
                            Fatias Necessárias <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="slices"
                            placeholder="ex: 2, 1"
                            value={form.slices}
                            onChange={(e) => handleChange("slices", e.target.value)}
                            disabled={isPublishing}
                          />
                          <p className="text-xs text-muted-foreground">Fatias para cada ativo (mesma ordem)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nome do Serviço <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="ex: Rede Privada 5G"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider">
                        Provedor <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="provider"
                        placeholder="ex: Enterprise Networks"
                        value={form.provider}
                        onChange={(e) => handleChange("provider", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">
                        Localização <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="location"
                        placeholder="ex: Customizable"
                        value={form.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">
                        URL da Imagem
                      </Label>
                      <Input
                        id="image"
                        placeholder="/placeholder.svg?height=300&width=300"
                        value={form.image}
                        onChange={(e) => handleChange("image", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="features">
                        Funcionalidades (separe por vírgula)
                      </Label>
                      <Input
                        id="features"
                        placeholder="ex: Dedicated Bandwidth, End-to-end Encryption, 24/7 Support"
                        value={form.features}
                        onChange={(e) => handleChange("features", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requiredAssets">
                        Ativos Necessários (separe por vírgula)
                      </Label>
                      <Input
                        id="requiredAssets"
                        placeholder="ex: Antena Setorial 5G, Espectro 700MHz"
                        value={form.requiredAssets}
                        onChange={(e) => handleChange("requiredAssets", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractType">
                        Tipo de Contrato
                      </Label>
                      <Input
                        id="contractType"
                        placeholder="ex: SLA Enterprise"
                        value={form.contractType}
                        onChange={(e) => handleChange("contractType", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slaLevel">
                        SLA (%)
                      </Label>
                      <Input
                        id="slaLevel"
                        placeholder="ex: 99.99%"
                        value={form.slaLevel}
                        onChange={(e) => handleChange("slaLevel", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                  </div>

                  {isPublishing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Publicando serviço...</span>
                        <span>{publishProgress}%</span>
                      </div>
                      <Progress value={publishProgress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {publishProgress < 25 && "Verificando permissões DID..."}
                        {publishProgress >= 25 && publishProgress < 50 && "Criando contrato inteligente..."}
                        {publishProgress >= 50 && publishProgress < 75 && "Registrando no backend..."}
                        {publishProgress >= 75 && "Confirmando na blockchain..."}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={isPublishing || !validateForm()}
                    className="w-full h-12 text-lg"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Server className="w-5 h-5 mr-2" />
                        Publicar Serviço
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
                </CardContent>
              </Card>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Como Funciona
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Definir Serviço</p>
                        <p className="text-sm text-muted-foreground">Configure preços e recursos necessários</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Contratos Automáticos</p>
                        <p className="text-sm text-muted-foreground">Pagamentos e SLAs gerenciados automaticamente</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Marketplace</p>
                        <p className="text-sm text-muted-foreground">Disponível para contratação imediata</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Resumo Financeiro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.price && form.finalPrice && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Preço Inicial</span>
                        <span className="font-medium">{form.price} TLC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Preço Final</span>
                        <span className="font-medium">{form.finalPrice} TLC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Margem</span>
                        <span className="font-medium text-green-600">
                          {(Number.parseFloat(form.finalPrice) - Number.parseFloat(form.price)).toFixed(0)} TLC
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Receita por Contrato</span>
                        <span className="text-green-600">{form.finalPrice} TLC</span>
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      Pagamentos são processados mensalmente através de contratos inteligentes.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Tipos de Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Redes Privadas</Badge>
                      <span className="text-sm text-muted-foreground">5G, LTE, WiFi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Conectividade</Badge>
                      <span className="text-sm text-muted-foreground">Backbone, última milha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">IoT</Badge>
                      <span className="text-sm text-muted-foreground">Sensores, monitoramento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Manutenção</Badge>
                      <span className="text-sm text-muted-foreground">Suporte técnico</span>
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
