"use client"

import { useState } from "react"
import {
  Search,
  Globe,
  Smartphone,
  Wifi,
  Filter,
  ShoppingCart,
  Heart,
  Shield,
  Radio,
  Server,
  Layers,
  Lock,
  Key,
  Wallet,
  Database,
  Activity,
  User,
  Coins,
  Building,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Tipos de ativos de telecomunicações
const assets = [
  {
    id: 1,
    name: "Torre de Telecomunicações T-450",
    type: "physical",
    category: "infrastructure",
    provider: "TelecomAssets Corp",
    price: 2500,
    priceUnit: "month",
    totalValue: 120000,
    slices: 10,
    availableSlices: 6,
    location: "São Paulo, Brasil",
    coordinates: "-23.5505, -46.6333",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Height: 45m", "Capacity: 800kg", "Wind Resistance: 120km/h"],
    contractType: "SLA Premium",
    tokenized: true,
    verified: true,
  },
  {
    id: 2,
    name: "Antena Setorial 5G",
    type: "physical",
    category: "equipment",
    provider: "NetEquip Solutions",
    price: 800,
    priceUnit: "month",
    totalValue: 15000,
    slices: 5,
    availableSlices: 3,
    location: "Rio de Janeiro, Brasil",
    coordinates: "-22.9068, -43.1729",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Frequency: 3.5GHz", "Gain: 18dBi", "Beamwidth: 65°"],
    contractType: "SLA Standard",
    tokenized: true,
    verified: true,
  },
  {
    id: 3,
    name: "Espectro 700MHz",
    type: "spectrum",
    category: "license",
    provider: "SpectrumShare Inc",
    price: 5000,
    priceUnit: "month",
    totalValue: 500000,
    slices: 8,
    availableSlices: 2,
    location: "Nacional",
    coordinates: "Multiple",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Bandwidth: 10MHz", "Duration: 5 years", "Regional Coverage"],
    contractType: "SLA Enterprise",
    tokenized: true,
    verified: true,
  },
  {
    id: 4,
    name: "Fibra Óptica - Backbone",
    type: "physical",
    category: "connectivity",
    provider: "FiberNet Brasil",
    price: 1200,
    priceUnit: "month",
    totalValue: 85000,
    slices: 12,
    availableSlices: 7,
    location: "Brasília → Goiânia",
    coordinates: "Linear Route",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Length: 210km", "Capacity: 100Gbps", "Redundancy: Yes"],
    contractType: "SLA Premium",
    tokenized: true,
    verified: false,
  },
  {
    id: 5,
    name: "Data Center Compartilhado",
    type: "physical",
    category: "infrastructure",
    provider: "DataCenters SA",
    price: 3500,
    priceUnit: "month",
    totalValue: 250000,
    slices: 15,
    availableSlices: 9,
    location: "Campinas, Brasil",
    coordinates: "-22.9099, -47.0626",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Rack Space: 42U", "Power: 5kVA", "Cooling: Included"],
    contractType: "SLA Enterprise",
    tokenized: true,
    verified: true,
  },
  {
    id: 6,
    name: "Licença de Operação Regional",
    type: "license",
    category: "regulatory",
    provider: "TeleRegulatory",
    price: 7500,
    priceUnit: "year",
    totalValue: 75000,
    slices: 1,
    availableSlices: 1,
    location: "Nordeste, Brasil",
    coordinates: "Regional",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Region: Northeast", "Duration: 10 years", "Service Type: Mobile"],
    contractType: "Regulatory",
    tokenized: false,
    verified: true,
  },
]

// Serviços de telecomunicações
const services = [
  {
    id: 1,
    name: "Rede Privada 5G",
    type: "service",
    category: "network",
    provider: "Enterprise Networks",
    price: 8500,
    priceUnit: "month",
    duration: "12 months",
    location: "Customizable",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Dedicated Bandwidth", "End-to-end Encryption", "24/7 Support"],
    requiredAssets: ["Antena Setorial 5G", "Espectro 700MHz"],
    contractType: "SLA Enterprise",
    tokenized: true,
  },
  {
    id: 2,
    name: "Conectividade Rural",
    type: "service",
    category: "connectivity",
    provider: "RuralConnect",
    price: 3200,
    priceUnit: "month",
    duration: "24 months",
    location: "Rural Areas",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Long Range Coverage", "Satellite Backup", "IoT Ready"],
    requiredAssets: ["Torre de Telecomunicações T-450", "Espectro 700MHz"],
    contractType: "SLA Standard",
    tokenized: true,
  },
  {
    id: 3,
    name: "Backbone de Alta Capacidade",
    type: "service",
    category: "connectivity",
    provider: "HighSpeed Networks",
    price: 12000,
    priceUnit: "month",
    duration: "36 months",
    location: "Interstate",
    image: "/placeholder.svg?height=300&width=300",
    features: ["100Gbps Capacity", "99.999% Uptime", "Low Latency"],
    requiredAssets: ["Fibra Óptica - Backbone", "Data Center Compartilhado"],
    contractType: "SLA Premium",
    tokenized: true,
  },
]

// Categorias
const categories = [
  { id: "all", name: "Todos os Itens", icon: Globe },
  { id: "infrastructure", name: "Infraestrutura", icon: Radio },
  { id: "equipment", name: "Equipamentos", icon: Smartphone },
  { id: "connectivity", name: "Conectividade", icon: Wifi },
  { id: "license", name: "Licenças", icon: Shield },
  { id: "service", name: "Serviços", icon: Server },
]

// Perfis de usuário
const userProfiles = [
  { id: "consumer", name: "Consumidor", description: "Contrate serviços e infraestrutura" },
  { id: "service_provider", name: "Provedor de Serviços", description: "Publique e gerencie serviços" },
  { id: "asset_provider", name: "Provedor de Ativos", description: "Ofereça infraestrutura física" },
]

export default function TelecomMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("marketplace")
  const [userProfile, setUserProfile] = useState("consumer")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [tlcBalance, setTlcBalance] = useState(0)

  // Filtrar itens com base na categoria e busca
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.provider.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const connectWallet = () => {
    // Simulação de conexão com carteira digital
    setWalletConnected(true)
    setWalletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
    setTlcBalance(5000)
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress("")
    setTlcBalance(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  D-MTS
                </h1>
                <p className="text-sm text-muted-foreground">Decentralized Telecom Marketplace</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select defaultValue="pt">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 EN</SelectItem>
                  <SelectItem value="pt">🇧🇷 PT</SelectItem>
                  <SelectItem value="es">🇪🇸 ES</SelectItem>
                  <SelectItem value="fr">🇫🇷 FR</SelectItem>
                </SelectContent>
              </Select>

              {walletConnected ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Wallet className="w-4 h-4" />
                      <span className="hidden md:inline">
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                      </span>
                      <Badge variant="secondary" className="ml-1">
                        {tlcBalance} TLC
                      </Badge>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Carteira Digital</DialogTitle>
                      <DialogDescription>Gerencie sua identidade digital e tokens</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Endereço</span>
                          <span className="text-sm font-medium">{walletAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Saldo TLC</span>
                          <span className="text-sm font-medium">{tlcBalance} TLC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Status DID</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Verificado
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Perfil</span>
                          <Badge>{userProfiles.find((p) => p.id === userProfile)?.name}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Contratos Ativos</h4>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs">Torre de Telecomunicações T-450</span>
                            <Badge variant="outline" className="text-xs">
                              Ativo
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Validade</span>
                            <span className="text-xs">12/12/2025</span>
                          </div>
                        </div>
                      </div>

                      <Button variant="destructive" onClick={disconnectWallet} className="w-full">
                        Desconectar Carteira
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button variant="outline" onClick={connectWallet} className="gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden md:inline">Conectar Carteira</span>
                </Button>
              )}

              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="w-4 h-4" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Marketplace Descentralizado
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              para Telecomunicações
            </span>
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Compartilhe e contrate infraestrutura de telecomunicações com segurança e transparência através de contratos
            inteligentes e identidades digitais descentralizadas.
          </p>

          {!walletConnected && (
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-8">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8 w-full"
                onClick={connectWallet}
              >
                <Key className="w-5 h-5 mr-2" />
                Conectar Carteira Digital
              </Button>
            </div>
          )}

          {walletConnected && (
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por torres, antenas, espectro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8">
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Lock className="w-4 h-4 mr-1" />
              Contratos Inteligentes
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Key className="w-4 h-4 mr-1" />
              Identidade Descentralizada
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Database className="w-4 h-4 mr-1" />
              Blockchain Hyperledger
            </Badge>
          </div>
        </div>
      </section>

      {/* Interactive Panels - Only show when wallet is connected */}
      {walletConnected && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Acesso Rápido</h2>
              <p className="text-muted-foreground text-lg">
                Gerencie seus ativos, serviços e contratos de forma descentralizada
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link href="/dashboard">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      Dashboard
                    </h3>
                    <p className="text-sm text-muted-foreground">Visão geral completa</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/exchange">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">
                      Exchange TLC
                    </h3>
                    <p className="text-sm text-muted-foreground">Comprar tokens</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/assets">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                      Ver Ativos
                    </h3>
                    <p className="text-sm text-muted-foreground">Explorar infraestrutura</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/services">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Server className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-pink-600 transition-colors">
                      Ver Serviços
                    </h3>
                    <p className="text-sm text-muted-foreground">Explorar serviços</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/publish-asset">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                      Publicar Ativo
                    </h3>
                    <p className="text-sm text-muted-foreground">Tokenizar infraestrutura</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/publish-service">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Server className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-cyan-600 transition-colors">
                      Publicar Serviço
                    </h3>
                    <p className="text-sm text-muted-foreground">Oferecer serviços</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/register-identity">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                      Identidade DID
                    </h3>
                    <p className="text-sm text-muted-foreground">Registrar perfil</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition-colors">
                      Painel Admin
                    </h3>
                    <p className="text-sm text-muted-foreground">Gerenciar pagamentos</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Onboarding Dialog */}
      {walletConnected && !userProfile && (
        <Dialog open={true}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bem-vindo ao D-MTS</DialogTitle>
              <DialogDescription>Selecione seu perfil para continuar</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {userProfiles.map((profile) => (
                <Button
                  key={profile.id}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => setUserProfile(profile.id)}
                >
                  <div className="text-left">
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-sm text-muted-foreground">{profile.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {walletConnected ? (
          <>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="contracts">Contratos</TabsTrigger>
              </TabsList>

              {/* Marketplace Tab */}
              <TabsContent value="marketplace">
                {/* Categories & Filters */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                  <div className="lg:w-1/4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Filter className="w-5 h-5" />
                          Categorias
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {categories.map((category) => {
                          const Icon = category.icon
                          return (
                            <Button
                              key={category.id}
                              variant={selectedCategory === category.id ? "default" : "ghost"}
                              className="w-full justify-start"
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {category.name}
                            </Button>
                          )
                        })}
                      </CardContent>
                    </Card>

                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Status da Rede
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Blockchain</span>
                            <Badge variant="outline" className="text-green-600">
                              Online
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Blocos</span>
                            <span className="text-sm font-medium">12,453,789</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Nós Ativos</span>
                            <span className="text-sm font-medium">24</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Contratos</span>
                            <span className="text-sm font-medium">1,245</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Uso da Rede</span>
                            <span>65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:w-3/4">
                    {/* Sort & Filter Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {categories.find((c) => c.id === selectedCategory)?.name || "Todos os Itens"}
                        </h3>
                        <p className="text-muted-foreground">
                          {filteredAssets.length + filteredServices.length} itens encontrados
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="featured">Destaques</SelectItem>
                            <SelectItem value="price-low">Preço: Menor para Maior</SelectItem>
                            <SelectItem value="price-high">Preço: Maior para Menor</SelectItem>
                            <SelectItem value="newest">Mais Recentes</SelectItem>
                            <SelectItem value="availability">Disponibilidade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Assets Section */}
                    {filteredAssets.length > 0 && (
                      <>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Layers className="w-5 h-5" />
                          Ativos de Infraestrutura
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {filteredAssets.map((asset) => (
                            <Card
                              key={asset.id}
                              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden"
                            >
                              <CardHeader className="p-0">
                                <div className="relative overflow-hidden">
                                  <img
                                    src={asset.image || "/placeholder.svg"}
                                    alt={asset.name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  {asset.tokenized && (
                                    <Badge className="absolute top-3 left-3 bg-purple-600 hover:bg-purple-700">
                                      <Database className="w-3 h-3 mr-1" />
                                      Tokenizado
                                    </Badge>
                                  )}
                                  {asset.verified && (
                                    <Badge className="absolute top-3 right-3 bg-green-600 hover:bg-green-700">
                                      <Shield className="w-3 h-3 mr-1" />
                                      Verificado
                                    </Badge>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute bottom-3 right-3 bg-white/80 hover:bg-white"
                                    onClick={() => toggleFavorite(asset.id)}
                                  >
                                    <Heart
                                      className={`w-4 h-4 ${
                                        favorites.includes(asset.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                                      }`}
                                    />
                                  </Button>
                                </div>
                              </CardHeader>

                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm text-muted-foreground">{asset.provider}</p>
                                    <h4 className="font-semibold text-lg leading-tight">{asset.name}</h4>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                                      {asset.type}
                                    </Badge>
                                    <Badge variant="outline">{asset.category}</Badge>
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {asset.features.map((feature, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="text-sm">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-muted-foreground">Localização:</span>
                                      <span className="font-medium">{asset.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Disponibilidade:</span>
                                      <span className="font-medium">
                                        {asset.availableSlices}/{asset.slices} fatias
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-green-600">${asset.price}</span>
                                        <span className="text-sm text-muted-foreground">/{asset.priceUnit}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Valor Total: ${asset.totalValue.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>

                              <CardFooter className="p-4 pt-0">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="w-full">
                                      <Lock className="w-4 h-4 mr-2" />
                                      Contratar Ativo
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Contratar Ativo</DialogTitle>
                                      <DialogDescription>
                                        Este contrato será registrado na blockchain usando smart contracts
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium">{asset.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Provedor: {asset.provider} | Tipo: {asset.type}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium">Preço por fatia</p>
                                          <p className="text-lg font-bold text-green-600">
                                            ${asset.price}/{asset.priceUnit}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Fatias disponíveis</p>
                                          <p className="text-lg font-bold">
                                            {asset.availableSlices}/{asset.slices}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Selecione o número de fatias</label>
                                        <Select defaultValue="1">
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {[...Array(asset.availableSlices)].map((_, i) => (
                                              <SelectItem key={i} value={(i + 1).toString()}>
                                                {i + 1} fatia{i > 0 ? "s" : ""}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Duração do contrato</label>
                                        <Select defaultValue="12">
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="3">3 meses</SelectItem>
                                            <SelectItem value="6">6 meses</SelectItem>
                                            <SelectItem value="12">12 meses</SelectItem>
                                            <SelectItem value="24">24 meses</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="bg-slate-50 p-3 rounded-md">
                                        <div className="flex justify-between mb-1">
                                          <span className="text-sm">Total estimado</span>
                                          <span className="text-lg font-bold text-green-600">$3,000</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-xs text-muted-foreground">Taxa de rede</span>
                                          <span className="text-xs">5 TLC</span>
                                        </div>
                                      </div>

                                      <Button className="w-full">
                                        <Lock className="w-4 h-4 mr-2" />
                                        Confirmar e Assinar Contrato
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Services Section */}
                    {filteredServices.length > 0 && (
                      <>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Server className="w-5 h-5" />
                          Serviços de Telecomunicações
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredServices.map((service) => (
                            <Card
                              key={service.id}
                              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden"
                            >
                              <CardHeader className="p-0">
                                <div className="relative overflow-hidden">
                                  <img
                                    src={service.image || "/placeholder.svg"}
                                    alt={service.name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  {service.tokenized && (
                                    <Badge className="absolute top-3 left-3 bg-purple-600 hover:bg-purple-700">
                                      <Database className="w-3 h-3 mr-1" />
                                      Tokenizado
                                    </Badge>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                                    onClick={() => toggleFavorite(service.id)}
                                  >
                                    <Heart
                                      className={`w-4 h-4 ${
                                        favorites.includes(service.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                                      }`}
                                    />
                                  </Button>
                                </div>
                              </CardHeader>

                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm text-muted-foreground">{service.provider}</p>
                                    <h4 className="font-semibold text-lg leading-tight">{service.name}</h4>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-purple-600 border-purple-600">
                                      {service.type}
                                    </Badge>
                                    <Badge variant="outline">{service.category}</Badge>
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {service.features.map((feature, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="text-sm">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-muted-foreground">Localização:</span>
                                      <span className="font-medium">{service.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Duração:</span>
                                      <span className="font-medium">{service.duration}</span>
                                    </div>
                                  </div>

                                  {service.requiredAssets && (
                                    <div className="space-y-1">
                                      <p className="text-xs text-muted-foreground">Ativos Necessários:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {service.requiredAssets.map((asset, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            <Layers className="w-3 h-3 mr-1" />
                                            {asset}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-green-600">${service.price}</span>
                                        <span className="text-sm text-muted-foreground">/{service.priceUnit}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{service.contractType}</p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>

                              <CardFooter className="p-4 pt-0">
                                <Button className="w-full">
                                  <Lock className="w-4 h-4 mr-2" />
                                  Contratar Serviço
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Meus Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">3</div>
                      <p className="text-sm text-muted-foreground">Ativos contratados ativos</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Torre de Telecomunicações T-450</span>
                          <Badge variant="outline" className="text-green-600">
                            Ativo
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Espectro 700MHz</span>
                          <Badge variant="outline" className="text-green-600">
                            Ativo
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Fibra Óptica - Backbone</span>
                          <Badge variant="outline" className="text-amber-600">
                            Pendente
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Meus Serviços</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">2</div>
                      <p className="text-sm text-muted-foreground">Serviços contratados ativos</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Rede Privada 5G</span>
                          <Badge variant="outline" className="text-green-600">
                            Ativo
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Backbone de Alta Capacidade</span>
                          <Badge variant="outline" className="text-green-600">
                            Ativo
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Meu Saldo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{tlcBalance} TLC</div>
                      <p className="text-sm text-muted-foreground">Saldo disponível</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Bloqueado em contratos</span>
                          <span className="font-medium">1,250 TLC</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Próximo pagamento</span>
                          <span className="font-medium">350 TLC</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Adicionar Fundos</Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Contrato Assinado</p>
                            <p className="text-sm text-muted-foreground">Torre de Telecomunicações T-450</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">-2,500 TLC</p>
                          <p className="text-sm text-muted-foreground">Hoje, 14:32</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Fundos Adicionados</p>
                            <p className="text-sm text-muted-foreground">Depósito via Carteira</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+5,000 TLC</p>
                          <p className="text-sm text-muted-foreground">Ontem, 09:15</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Key className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Identidade Verificada</p>
                            <p className="text-sm text-muted-foreground">DID Registrado</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">-</p>
                          <p className="text-sm text-muted-foreground">15/05/2024, 11:22</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contracts Tab */}
              <TabsContent value="contracts">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Contratos Ativos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Torre de Telecomunicações T-450</h4>
                          <Badge>Ativo</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ID do Contrato</span>
                            <span className="font-mono">0x71C7...976F</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Provedor</span>
                            <span>TelecomAssets Corp</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valor Mensal</span>
                            <span>$2,500</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Início</span>
                            <span>01/05/2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Término</span>
                            <span>01/05/2025</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          Ver Detalhes
                        </Button>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">Rede Privada 5G</h4>
                          <Badge>Ativo</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ID do Contrato</span>
                            <span className="font-mono">0x82D9...124A</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Provedor</span>
                            <span>Enterprise Networks</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valor Mensal</span>
                            <span>$8,500</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Início</span>
                            <span>15/04/2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Término</span>
                            <span>15/04/2025</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Smart Contracts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">IndyDidRegistry</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Endereço</span>
                              <span className="font-mono">0x9F8D...42E1</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Função</span>
                              <span>Registro de Identidade</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status</span>
                              <Badge variant="outline" className="text-green-600">
                                Ativo
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">AssetRegistry</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Endereço</span>
                              <span className="font-mono">0x71C7...976F</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Função</span>
                              <span>Registro de Ativos</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status</span>
                              <Badge variant="outline" className="text-green-600">
                                Ativo
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">ServiceRegistry</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Endereço</span>
                              <span className="font-mono">0x82D9...124A</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Função</span>
                              <span>Registro de Serviços</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status</span>
                              <Badge variant="outline" className="text-green-600">
                                Ativo
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Conecte sua carteira digital</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Para acessar o marketplace descentralizado, você precisa conectar sua carteira digital e criar sua
              identidade descentralizada (DID).
            </p>
            <Button size="lg" onClick={connectWallet}>
              <Wallet className="w-5 h-5 mr-2" />
              Conectar Carteira
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">D-MTS</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Marketplace descentralizado para compartilhamento de infraestrutura de telecomunicações.
              </p>
              <div className="flex gap-4">
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  <Database className="w-3 h-3 mr-1" />
                  Hyperledger Besu
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ativos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Torres</li>
                <li>Antenas</li>
                <li>Espectro</li>
                <li>Fibra Óptica</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Redes Privadas</li>
                <li>Conectividade Rural</li>
                <li>Backbone</li>
                <li>Data Centers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentação</li>
                <li>API</li>
                <li>Smart Contracts</li>
                <li>Governança</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 D-MTS: Decentralized Marketplace for Telecommunication Services | Baseado no artigo de Jeffson
              C. Sousa et al.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
