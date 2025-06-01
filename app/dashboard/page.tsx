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
import { assert } from "console"
import { ethers } from "ethers"

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
    title: "Contratos Ativos",
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

  useEffect(() => {
    // Simular verificação de carteira conectada
    const checkWallet = () => {
      if (typeof window !== "undefined" && window.ethereum) {
        setWalletConnected(true)
        setUserAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
      }
    }
    checkWallet()
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
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  D-MTS Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Marketplace Descentralizado</p>
              </div>
            </div>

            {walletConnected && (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Activity className="w-3 h-3 mr-1" />
                  Conectado
                </Badge>
                <Badge variant="secondary">
                  {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                </Badge>
              </div>
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
            <TabsTrigger value="activity">Atividade</TabsTrigger>
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
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Governança Descentralizada</p>
                        <p className="text-sm text-muted-foreground">Participe das decisões usando tokens TLC</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Status da Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center py-6">
                    <a
                      href="https://chainless.io/" // Altere para o link do seu block explorer se necessário
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                    >
                      Acessar Block Explorer
                    </a>
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

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === "asset"
                            ? "bg-blue-100"
                            : activity.type === "service"
                              ? "bg-green-100"
                              : "bg-purple-100"
                            }`}
                        >
                          {activity.type === "asset" ? (
                            <Building className="w-5 h-5 text-blue-600" />
                          ) : activity.type === "service" ? (
                            <Server className="w-5 h-5 text-green-600" />
                          ) : (
                            <User className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.amount}</p>
                        <Badge
                          variant={activity.status === "success" ? "default" : "secondary"}
                          className={
                            activity.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {activity.status === "success" ? "Concluído" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
