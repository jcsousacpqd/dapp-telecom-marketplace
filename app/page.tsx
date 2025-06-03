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
import { blockchainService } from "@/lib/blockchain"
import { useRouter } from "next/navigation"

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

// Tipos e traduções globais

type Lang = 'pt' | 'en' | 'es' | 'fr';
interface Translation {
  [key: string]: any;
  connectWallet: string;
  startMarketplace: string;
  searchPlaceholder: string;
  welcome: string;
  selectProfile: string;
  dashboard: string;
  exchange: string;
  assets: string;
  services: string;
  publishAsset: string;
  publishService: string;
  registerIdentity: string;
  adminPanel: string;
  quickAccess: string;
  manageAssets: string;
  categories: string;
  networkStatus: string;
  blockchain: string;
  online: string;
  blocks: string;
  activeNodes: string;
  contracts: string;
  networkUsage: string;
  highlights: string;
  priceLow: string;
  priceHigh: string;
  newest: string;
  availability: string;
  allItems: string;
  infrastructure: string;
  equipment: string;
  connectivity: string;
  licenses: string;
  service: string;
  foundItems: (n: number) => string;
  infraAssets: string;
  telecomServices: string;
  hireAsset: string;
  hireService: string;
  requiredAssets: string;
  totalValue: string;
  location: string;
  duration: string;
  contractType: string;
  tokenized: string;
  verified: string;
  smartContracts: string;
  activeContracts: string;
  myAssets: string;
  myServices: string;
  myBalance: string;
  availableBalance: string;
  locked: string;
  nextPayment: string;
  addFunds: string;
  recentActivity: string;
  connectToAccess: string;
}

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
  const [lang, setLang] = useState<Lang>('pt')
  const t: Translation = {
    connectWallet: "Conectar Carteira",
    startMarketplace: "Iniciar o Marketplace",
    searchPlaceholder: "Buscar por torres, antenas, espectro...",
    welcome: "Bem-vindo ao D-MTS",
    selectProfile: "Selecione seu perfil para continuar",
    dashboard: "Dashboard",
    exchange: "Exchange TLC",
    assets: "Ver Ativos",
    services: "Ver Serviços",
    publishAsset: "Publicar Ativo",
    publishService: "Publicar Serviço",
    registerIdentity: "Identidade DID",
    adminPanel: "Painel Admin",
    quickAccess: "Acesso Rápido",
    manageAssets: "Gerencie seus ativos, serviços e contratos de forma descentralizada",
    categories: "Categorias",
    networkStatus: "Status da Rede",
    blockchain: "Blockchain",
    online: "Online",
    blocks: "Blocos",
    activeNodes: "Nós Ativos",
    contracts: "Contratos",
    networkUsage: "Uso da Rede",
    highlights: "Destaques",
    priceLow: "Preço: Menor para Maior",
    priceHigh: "Preço: Maior para Menor",
    newest: "Mais Recentes",
    availability: "Disponibilidade",
    allItems: "Todos os Itens",
    infrastructure: "Infraestrutura",
    equipment: "Equipamentos",
    connectivity: "Conectividade",
    licenses: "Licenças",
    service: "Serviços",
    foundItems: (n: number) => `${n} itens encontrados`,
    infraAssets: "Ativos de Infraestrutura",
    telecomServices: "Serviços de Telecomunicações",
    hireAsset: "Contratar Ativo",
    hireService: "Contratar Serviço",
    requiredAssets: "Ativos Necessários:",
    totalValue: "Valor Total:",
    location: "Localização:",
    duration: "Duração:",
    contractType: "Tipo de Contrato",
    tokenized: "Tokenizado",
    verified: "Verificado",
    smartContracts: "Smart Contracts",
    activeContracts: "Contratos Ativos",
    myAssets: "Meus Ativos",
    myServices: "Meus Serviços",
    myBalance: "Meu Saldo",
    availableBalance: "Saldo disponível",
    locked: "Bloqueado em contratos",
    nextPayment: "Próximo pagamento",
    addFunds: "Adicionar Fundos",
    recentActivity: "Atividade Recente",
    connectToAccess: "Para acessar o marketplace descentralizado, você precisa conectar sua carteira digital e criar sua identidade descentralizada (DID).",
  }

  const router = useRouter();

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

  const connectWallet = async () => {
    try {
      const address = await blockchainService.connectWallet();
      setWalletConnected(true);
      setWalletAddress(address);
      try {
        const balance = await blockchainService.getTLCBalance(address);
        setTlcBalance(Number(balance));
      } catch {
        setTlcBalance(0);
      }
      router.push("/dashboard");
    } catch {
      setWalletConnected(false);
      setWalletAddress("");
      setTlcBalance(0);
    }
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress("")
    setTlcBalance(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-row items-center gap-2">
              <img src="/IEEE-ICBC-Logo.png" alt="IEEE ICBC Logo" className="h-10 w-auto" />
              <img src="/logo-cpqd.webp" alt="D-MTS Logo" className="h-10 w-auto" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0057b7]">D-MTS</h1>
              <p className="text-sm text-blue-900">Decentralized Telecom Marketplace</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0057b7] via-blue-600 to-[#ffd600] text-white py-16 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Marketplace Descentralizado
            <span className="block bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text">
              para Telecomunicações
            </span>
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Compartilhe e contrate infraestrutura de telecomunicações com segurança e transparência através de contratos inteligentes e identidades digitais descentralizadas.
          </p>
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Let's Get Started</h3>
            <p className="text-white-200 mb-8 max-w-md mx-auto">
              Para acessar o marketplace descentralizado, você precisa conectar sua carteira digital e criar sua identidade descentralizada (DID).
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div
                className="rounded-xl border border-blue-200 bg-white/80 p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer hover:bg-blue-50"
                onClick={connectWallet}
              >
                <Wallet className="w-8 h-8 text-blue-700 mb-2" />
                <span className="font-semibold text-blue-900 text-lg mb-1">Já tenho carteira</span>
                <span className="text-blue-700 text-sm">Conectar carteira existente</span>
              </div>
              <div
                className="rounded-xl border border-yellow-300 bg-white/80 p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer hover:bg-yellow-50"
                onClick={() => router.push('/connect-wallet')}
              >
                <Key className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="font-semibold text-yellow-700 text-lg mb-1">Criar nova carteira</span>
                <span className="text-yellow-700 text-sm">Gerar carteira digital e identidade</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-blue-900 py-12 mt-16 border-t border-blue-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex flex-row items-center gap-2">
                  <img src="/IEEE-ICBC-Logo.png" alt="IEEE ICBC Logo" className="h-8 w-auto" />
                  <img src="/cpqd-5g.webp" alt="D-MTS Logo" className="h-8 w-auto" />
                </div>
                <h3 className="text-xl font-bold text-[#0057b7]">D-MTS</h3>
              </div>
              <p className="text-blue-900 mb-4">
                Marketplace descentralizado para compartilhamento de infraestrutura de telecomunicações.
              </p>
              <div className="flex gap-4">
                <Badge variant="outline" className="border-blue-900 text-blue-900 bg-blue-50">
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

          <div className="border-t border-blue-100 mt-8 pt-8 text-center text-blue-900">
            <p>
              &copy; 2025 D-MTS: Decentralized Marketplace for Telecommunication Services | Demo Application for ICBC 2025 by Jeffson
              C. Sousa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
