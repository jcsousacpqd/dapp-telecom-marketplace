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
import { Building, ArrowLeft, Shield, Database, Loader2, Info, DollarSign, Calendar, Layers } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api"
import { blockchainService } from "@/lib/blockchain"
import { ethers } from "ethers"

interface AssetForm {
  id: string
  name: string
  type: string
  category: string
  provider: string
  price: string
  priceUnit: string
  totalValue: string
  slices: string
  availableSlices: string
  location: string
  image: string
  features: string
  contractType: string
  tokenized: boolean
  verified: boolean
  description: string
  amount: string
  monthsAvailable: string
  pricePerSlice: string
}

export default function PublishAsset() {
  const [form, setForm] = useState<AssetForm>({
    id: "",
    name: "",
    type: "physical",
    category: "infrastructure",
    provider: "",
    price: "",
    priceUnit: "month",
    totalValue: "",
    slices: "",
    availableSlices: "",
    location: "",
    image: "/placeholder.svg?height=300&width=300",
    features: "",
    contractType: "SLA Premium",
    tokenized: true,
    verified: true,
    description: "",
    amount: "",
    monthsAvailable: "",
    pricePerSlice: "",
  })
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishProgress, setPublishProgress] = useState(0)
  const [status, setStatus] = useState<string | null>(null)
  const [userRoleChecked, setUserRoleChecked] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkUserRole() {
      try {
        await blockchainService.ensureProvider();
        if (!window.ethereum) return alert('Wallet não detectada');
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
        const allowedRoles = ["asset-provider"]
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

  const handleChange = (field: keyof AssetForm, value: string) => {
    setForm({ ...form, [field]: value })

    // Auto-calculate price per slice
    if (field === "totalValue" || field === "slices") {
      const total = Number.parseFloat(field === "totalValue" ? value : form.totalValue)
      const slices = Number.parseFloat(field === "slices" ? value : form.slices)
      if (total > 0 && slices > 0) {
        setForm((prev) => ({ ...prev, pricePerSlice: (total / slices).toFixed(2) }))
      }
    }
  }

  const validateForm = () => {
    const requiredFields = ["id", "name", "type", "category", "provider", "price", "priceUnit", "totalValue", "slices", "availableSlices", "location", "image", "features", "contractType", "description", "amount", "monthsAvailable", "pricePerSlice"]
    return requiredFields.every((field) => String(form[field as keyof AssetForm]).trim() !== "")
  }

  const handleSubmit = async () => {
    if (!userRoleChecked) {
      alert("Aguarde a verificação de identidade...")
      return
    }
    if (!hasPermission) {
      alert("❌ Permissão negada. Sua identidade não possui o papel necessário para publicar ativos.")
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

      // Registrar ativo na blockchain e backend
      setPublishProgress(50)
      const result = await apiService.registerAsset({
        id: form.id,
        description: form.description,
        amount: Number.parseInt(form.amount),
        slices: Number.parseInt(form.slices),
        monthsAvailable: Number.parseInt(form.monthsAvailable),
        totalPrice: form.totalValue,
        pricePerSlice: form.pricePerSlice,
        // extras para o backend
        name: form.name,
        type: form.type,
        category: form.category,
        provider: form.provider,
        price: form.price,
        priceUnit: form.priceUnit,
        totalValue: form.totalValue,
        availableSlices: Number.parseInt(form.availableSlices),
        location: form.location,
        image: form.image,
        features: form.features.split(',').map(f => f.trim()),
        contractType: form.contractType,
        tokenized: form.tokenized,
        verified: form.verified,
      });

      setPublishProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Confirmação final
      setPublishProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStatus(`✅ Ativo publicado com sucesso! TX: ${result.txHash?.slice(0, 10)}...`)
      setForm({
        id: "",
        name: "",
        type: "physical",
        category: "infrastructure",
        provider: "",
        price: "",
        priceUnit: "month",
        totalValue: "",
        slices: "",
        availableSlices: "",
        location: "",
        image: "/placeholder.svg?height=300&width=300",
        features: "",
        contractType: "SLA Premium",
        tokenized: true,
        verified: true,
        description: "",
        amount: "",
        monthsAvailable: "",
        pricePerSlice: "",
      })
    } catch (err) {
      console.error(err)
      setStatus("❌ Erro ao publicar ativo.")
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
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Publicar Ativo
              </h1>
              <p className="text-sm text-muted-foreground">Tokenize sua infraestrutura de telecomunicações</p>
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
                    Informações do Ativo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Seu ativo será tokenizado e registrado na blockchain. Certifique-se de que possui as permissões
                      necessárias.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="id">
                        ID do Ativo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="id"
                        placeholder="ex: TOWER-SP-001"
                        value={form.id}
                        onChange={(e) => handleChange("id", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">
                        Quantidade Disponível <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="ex: 1"
                        value={form.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Descrição do Ativo <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva detalhadamente seu ativo de telecomunicações..."
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      disabled={isPublishing}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slices">
                        Número de Fatias <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="slices"
                        type="number"
                        placeholder="ex: 10"
                        value={form.slices}
                        onChange={(e) => handleChange("slices", e.target.value)}
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

                    <div className="space-y-2">
                      <Label htmlFor="totalValue">
                        Valor Total (TLC) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="totalValue"
                        type="number"
                        placeholder="ex: 5000"
                        value={form.totalValue}
                        onChange={(e) => handleChange("totalValue", e.target.value)}
                        disabled={isPublishing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerSlice">Preço por Fatia (TLC)</Label>
                    <Input
                      id="pricePerSlice"
                      type="number"
                      placeholder="Calculado automaticamente"
                      value={form.pricePerSlice}
                      disabled
                      className="bg-slate-50"
                    />
                  </div>

                  {isPublishing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Publicando ativo...</span>
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
                        <Building className="w-5 h-5 mr-2" />
                        Publicar Ativo
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

                  {/* Novos campos para o backend */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Ativo</Label>
                      <Input id="name" placeholder="ex: Torre de Telecomunicações T-450" value={form.name} onChange={e => handleChange("name", e.target.value)} disabled={isPublishing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provedor</Label>
                      <Input id="provider" placeholder="ex: TelecomAssets Corp" value={form.provider} onChange={e => handleChange("provider", e.target.value)} disabled={isPublishing} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Input id="type" placeholder="ex: physical" value={form.type} onChange={e => handleChange("type", e.target.value)} disabled={isPublishing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Input id="category" placeholder="ex: infrastructure" value={form.category} onChange={e => handleChange("category", e.target.value)} disabled={isPublishing} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (TLC/mês)</Label>
                      <Input id="price" type="number" placeholder="ex: 2500" value={form.price} onChange={e => handleChange("price", e.target.value)} disabled={isPublishing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceUnit">Unidade de Preço</Label>
                      <Input id="priceUnit" placeholder="ex: month" value={form.priceUnit} onChange={e => handleChange("priceUnit", e.target.value)} disabled={isPublishing} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="availableSlices">Fatias Disponíveis</Label>
                      <Input id="availableSlices" type="number" placeholder="ex: 6" value={form.availableSlices} onChange={e => handleChange("availableSlices", e.target.value)} disabled={isPublishing} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input id="location" placeholder="ex: São Paulo, Brasil" value={form.location} onChange={e => handleChange("location", e.target.value)} disabled={isPublishing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL da Imagem</Label>
                    <Input id="image" placeholder="/placeholder.svg?height=300&width=300" value={form.image} onChange={e => handleChange("image", e.target.value)} disabled={isPublishing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="features">Características (separadas por vírgula)</Label>
                    <Input id="features" placeholder="ex: Height: 45m, Capacity: 800kg, Wind Resistance: 120km/h" value={form.features} onChange={e => handleChange("features", e.target.value)} disabled={isPublishing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractType">Tipo de Contrato</Label>
                    <Input id="contractType" placeholder="ex: SLA Premium" value={form.contractType} onChange={e => handleChange("contractType", e.target.value)} disabled={isPublishing} />
                  </div>
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
                        <p className="font-medium">Tokenização</p>
                        <p className="text-sm text-muted-foreground">
                          Seu ativo é dividido em fatias digitais negociáveis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Contratos Inteligentes</p>
                        <p className="text-sm text-muted-foreground">Pagamentos e acordos automatizados</p>
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
                  {form.totalValue && form.slices && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Valor Total</span>
                        <span className="font-medium">{form.totalValue} TLC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fatias</span>
                        <span className="font-medium">{form.slices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Preço por Fatia</span>
                        <span className="font-medium">{form.pricePerSlice} TLC</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Receita Potencial</span>
                        <span className="text-green-600">{form.totalValue} TLC</span>
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
                    Tipos de Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Torres</Badge>
                      <span className="text-sm text-muted-foreground">Infraestrutura física</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Antenas</Badge>
                      <span className="text-sm text-muted-foreground">Equipamentos de transmissão</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Espectro</Badge>
                      <span className="text-sm text-muted-foreground">Licenças de frequência</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Fibra Óptica</Badge>
                      <span className="text-sm text-muted-foreground">Conectividade backbone</span>
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
