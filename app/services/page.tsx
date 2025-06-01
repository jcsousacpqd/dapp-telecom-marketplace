"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Server,
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Clock,
  Shield,
  Database,
  Heart,
  Eye,
  DollarSign,
  Calendar,
  Layers,
  Wifi,
  Radio,
  Globe,
} from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  name: string
  type: string
  category: string
  provider: string
  price: number
  priceUnit: string
  duration: string
  location: string
  image: string
  features: string[]
  requiredAssets?: string[]
  contractType: string
  tokenized: boolean
  description: string
  slaLevel: string
}

const categories = [
  { id: "all", name: "Todos", icon: Server },
  { id: "network", name: "Redes", icon: Wifi },
  { id: "connectivity", name: "Conectividade", icon: Globe },
  { id: "iot", name: "IoT", icon: Radio },
  { id: "maintenance", name: "Manutenção", icon: Shield },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('http://localhost:3001/api/services')
        const data = await res.json()
        setServices(Array.isArray(data) ? data : [])
      } catch (e) {
        setError('Erro ao carregar serviços')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const name = typeof service.name === 'string' ? service.name : ''
    const provider = typeof service.provider === 'string' ? service.provider : ''
    const location = typeof service.location === 'string' ? service.location : ''
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number(a.price) - Number(b.price)
      case "price-high":
        return Number(b.price) - Number(a.price)
      case "duration":
        return Number.parseInt(a.duration) - Number.parseInt(b.duration)
      case "newest":
        return a.id.localeCompare(b.id)
      default:
        return 0
    }
  })

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((serviceId) => serviceId !== id) : [...prev, id]))
  }

  const getSlaColor = (sla: string) => {
    const percentage = Number.parseFloat(sla)
    if (percentage >= 99.9) return "text-green-600"
    if (percentage >= 99.5) return "text-yellow-600"
    return "text-orange-600"
  }

  if (loading) return <div>Carregando serviços...</div>
  if (error) return <div>{error}</div>

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
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                Serviços Disponíveis
              </h1>
              <p className="text-sm text-muted-foreground">Explore serviços de telecomunicações</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Buscar</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Nome, provedor, localização..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <div className="space-y-2">
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ordenar por</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Destaques</SelectItem>
                        <SelectItem value="price-low">Preço: Menor para Maior</SelectItem>
                        <SelectItem value="price-high">Preço: Maior para Menor</SelectItem>
                        <SelectItem value="duration">Duração</SelectItem>
                        <SelectItem value="newest">Mais Recentes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    {categories.find((c) => c.id === selectedCategory)?.name || "Todos os Serviços"}
                  </h3>
                  <p className="text-muted-foreground">{sortedServices.length} serviços encontrados</p>
                </div>

                <Alert className="max-w-md">
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Serviços com SLA garantido e pagamentos automatizados via smart contracts.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.map((service) => (
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
                        <Badge className={`absolute top-3 right-3 ${getSlaColor(service.slaLevel)} bg-white`}>
                          <Shield className="w-3 h-3 mr-1" />
                          SLA {service.slaLevel}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-3 right-3 bg-white/80 hover:bg-white"
                          onClick={() => toggleFavorite(service.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${favorites.includes(service.id) ? "fill-red-500 text-red-500" : "text-gray-600"
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
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-600 border-purple-600">
                            {service.type}
                          </Badge>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(service.features) ? service.features : []).slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {Array.isArray(service.features) && service.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{service.features.length - 2} mais
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{service.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{service.contractType}</span>
                          </div>
                        </div>

                        {service.requiredAssets && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Ativos Necessários:</p>
                            <div className="flex flex-wrap gap-1">
                              {service.requiredAssets.slice(0, 2).map((asset, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Layers className="w-3 h-3 mr-1" />
                                  {asset}
                                </Badge>
                              ))}
                              {service.requiredAssets.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{service.requiredAssets.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-2xl font-bold text-green-600">{service.price}</span>
                              <span className="text-sm text-muted-foreground">TLC/{service.priceUnit}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{service.contractType}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 space-y-2">
                      <div className="flex gap-2 w-full">
                        <Link href={`/hire-service/${service.id}`} className="flex-1">
                          <Button className="w-full">
                            <Server className="w-4 h-4 mr-2" />
                            Contratar
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {sortedServices.length === 0 && (
                <div className="text-center py-12">
                  <Server className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum serviço encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou termos de busca para encontrar serviços disponíveis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
