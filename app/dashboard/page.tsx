"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  User,
  Coins,
  Building,
  Server,
  Settings,
  Database,
  Activity,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { blockchainService } from "@/lib/blockchain"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const menuItems = [
  {
    href: "/connect-wallet",
    icon: Wallet,
    title: "Conectar Carteira",
    description: "Conecte sua carteira MetaMask",
    color: "bg-blue-500",
  },
  {
    href: "/register-identity",
    icon: User,
    title: "Registrar Identidade (DID)",
    description: "Crie sua identidade descentralizada",
    color: "bg-purple-500",
  },
  {
    href: "/exchange",
    icon: Coins,
    title: "Carregar TLC",
    description: "Adicione tokens TLC à sua carteira",
    color: "bg-green-500",
  },
  {
    href: "/publish-asset",
    icon: Building,
    title: "Publicar Ativo",
    description: "Publique infraestrutura para aluguel",
    color: "bg-orange-500",
  },
  {
    href: "/publish-service",
    icon: Server,
    title: "Publicar Serviço",
    description: "Ofereça serviços de telecomunicações",
    color: "bg-cyan-500",
  },
  {
    href: "/assets",
    icon: Building,
    title: "Ver Ativos",
    description: "Explore ativos disponíveis",
    color: "bg-indigo-500",
  },
  {
    href: "/services",
    icon: Server,
    title: "Ver Serviços",
    description: "Navegue pelos serviços oferecidos",
    color: "bg-pink-500",
  },
  {
    href: "/admin",
    icon: Settings,
    title: "Painel Admin",
    description: "Gerencie pagamentos e contratos",
    color: "bg-red-500",
  },
]

const statsDefault = [
  {
    title: "Ativos Ativos",
    value: "-",
    change: "",
    icon: Building,
    color: "text-blue-600",
  },
  {
    title: "Serviços Disponíveis",
    value: "-",
    change: "",
    icon: Server,
    color: "text-green-600",
  },
  {
    title: "Contratos Criados",
    value: "-",
    change: "",
    icon: Database,
    color: "text-purple-600",
  },
  {
    title: "Volume TLC",
    value: "-",
    change: "",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

const recentActivity = [
  {
    type: "asset",
    title: "Torre T-450 contratada",
    user: "0x71C7...976F",
    amount: "2,500 TLC",
    time: "2 min atrás",
    status: "success",
  },
  {
    type: "service",
    title: "Rede 5G publicada",
    user: "0x82D9...124A",
    amount: "8,500 TLC",
    time: "15 min atrás",
    status: "pending",
  },
  {
    type: "identity",
    title: "Nova identidade registrada",
    user: "0x9F8D...42E1",
    amount: "-",
    time: "1 hora atrás",
    status: "success",
  },
]

export default function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [stats, setStats] = useState(statsDefault)
  const router = useRouter();

  useEffect(() => {
    async function checkWallet() {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const address = await blockchainService.connectWallet();
          setWalletConnected(true);
          setUserAddress(address);
        } catch {
          setWalletConnected(false);
          setUserAddress("");
        }
      }
    }
    checkWallet();
  }, [])

  useEffect(() => {
    async function loadStats() {
      try {
        // Buscar ativos via API REST
        const assetsRes = await fetch('http://localhost:3001/api/assets')
        const assetsData = await assetsRes.json()
        const assetsCount = Array.isArray(assetsData) ? assetsData.length : 0
        // Buscar serviços via API REST
        const serviceRes = await fetch('http://localhost:3001/api/services')
        const serviceData = await serviceRes.json()
        const serviceCount = Array.isArray(serviceData) ? serviceData.length : 0

        // Buscar ativos e serviços alugados via API REST
        const buyserviceRes = await fetch('http://localhost:3001/api/hired-services')
        const buyserviceData = await buyserviceRes.json()
        const buyserviceCount = Array.isArray(buyserviceData) ? buyserviceData.length : 0

        // Buscar ativos e serviços alugados via API REST
        const buyassetRes = await fetch('http://localhost:3001/api/hired-assets')
        const buyassetData = await buyassetRes.json()
        const buyassetCount = Array.isArray(buyassetData) ? buyassetData.length : 0
        const totalCount = buyserviceCount + buyassetCount

        // Buscar volume total TLC na blockchain
        let tlcVolume = "-"
        try {
          tlcVolume = await blockchainService.getTLCVolume()
        } catch (e) {
          tlcVolume = "-"
        }
        setStats([
          { ...statsDefault[0], value: assetsCount.toString() },
          { ...statsDefault[1], value: serviceCount.toString() },
          { ...statsDefault[2], value: totalCount.toString() },
          { ...statsDefault[3], value: tlcVolume },
        ])
      } catch (e) {
        setStats(statsDefault)
      }
    }
    loadStats()
  }, [walletConnected, userAddress])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            {walletConnected && userAddress ? (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Activity className="w-3 h-3 mr-1" />
                  Conectado
                </Badge>
                <Badge variant="secondary">
                  {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                </Badge>
              </div>
            ) : (
              <Button onClick={async () => {
                try {
                  const address = await blockchainService.connectWallet();
                  setWalletConnected(true);
                  setUserAddress(address);
                } catch {
                  setWalletConnected(false);
                  setUserAddress("");
                }
              }} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Wallet className="w-4 h-4 mr-2" />
                Conectar Carteira
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Bem-vindo ao Marketplace Descentralizado</h2>
          <p className="text-muted-foreground text-lg">
            Gerencie ativos de telecomunicações, publique serviços e participe da economia descentralizada.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="actions">Ações Rápidas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">{stat.change}</span> desde o último mês
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Features Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Recursos da Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Tokenização de Ativos</p>
                        <p className="text-sm text-muted-foreground">
                          Transforme infraestrutura física em ativos digitais negociáveis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Identidade Descentralizada</p>
                        <p className="text-sm text-muted-foreground">
                          Gerencie identidades seguras usando tecnologia DID
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Contratos Inteligentes</p>
                        <p className="text-sm text-muted-foreground">Automatize pagamentos e acordos com blockchain</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Rede</span>
                      <Badge variant="outline" className="text-green-600">
                        Hyperledger Besu
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant="outline" className="text-green-600">
                        Online
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Explorador de Blocos</span>
                      <a
                        href="http://localhost:26000/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-base"
                      >
                        <Database className="w-5 h-5" />
                        Acessar Explorador
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <Link key={index} href={item.href}>
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </CardTitle>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
              <ul className="space-y-2 text-blue-900">
                <li>Torres</li>
                <li>Antenas</li>
                <li>Espectro</li>
                <li>Fibra Óptica</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-blue-900">
                <li>Redes Privadas</li>
                <li>Conectividade Rural</li>
                <li>Backbone</li>
                <li>Data Centers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-blue-900">
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
