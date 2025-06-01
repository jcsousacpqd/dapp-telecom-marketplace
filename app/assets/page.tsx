"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building,
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Layers,
  Shield,
  Database,
  Heart,
  Eye,
  DollarSign,
  Calendar,
  Radio,
  Smartphone,
  Wifi,
} from "lucide-react"
import Link from "next/link"

interface Asset {
  id: string
  name: string
  type: string
  category: string
  provider: string
  price: number
  priceUnit: string
  totalValue: number
  slices: number
  availableSlices: number
  location: string
  image: string
  features: string[]
  contractType: string
  tokenized: boolean
  verified: boolean
  description: string
}

const categories = [
  { id: "all", name: "Todos", icon: Building },
  { id: "infrastructure", name: "Infraestrutura", icon: Radio },
  { id: "equipment", name: "Equipamentos", icon: Smartphone },
  { id: "connectivity", name: "Conectividade", icon: Wifi },
  { id: "license", name: "Licenças", icon: Shield },
  { id: "regulatory", name: "Regulatório", icon: Database },
]

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch('http://localhost:3001/api/assets')
        const data = await res.json()
        setAssets(Array.isArray(data) ? data : [])
      } catch (e) {
        setError('Erro ao carregar ativos')
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }, [])

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    const name = typeof asset.name === 'string' ? asset.name : ''
    const provider = typeof asset.provider === 'string' ? asset.provider : ''
    const location = typeof asset.location === 'string' ? asset.location : ''
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "availability":
        return b.availableSlices - a.availableSlices
      case "newest":
        return a.id.localeCompare(b.id)
      default:
        return 0
    }
  })

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((assetId) => assetId !== id) : [...prev, id]))
  }

  if (loading) return <div>Carregando ativos...</div>
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
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                Ativos Disponíveis
              </h1>
              <p className="text-sm text-muted-foreground">Explore infraestrutura de telecomunicações</p>
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
                        <SelectItem value="availability">Disponibilidade</SelectItem>
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
                    {categories.find((c) => c.id === selectedCategory)?.name || "Todos os Ativos"}
                  </h3>
                  <p className="text-muted-foreground">{sortedAssets.length} ativos encontrados</p>
                </div>

                <Alert className="max-w-md">
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Todos os ativos são tokenizados e verificados na blockchain Hyperledger Besu.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAssets.map((asset) => (
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
                            className={`w-4 h-4 ${favorites.includes(asset.id) ? "fill-red-500 text-red-500" : "text-gray-600"
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
                          <p className="text-sm text-muted-foreground mt-1">{asset.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            {asset.type}
                          </Badge>
                          <Badge variant="outline">{asset.category}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(asset.features) ? asset.features : []).slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {Array.isArray(asset.features) && asset.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{asset.features.length - 2} mais
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{asset.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {asset.availableSlices}/{asset.slices} fatias disponíveis
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{asset.contractType}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-2xl font-bold text-green-600">{asset.price}</span>
                              <span className="text-sm text-muted-foreground">TLC/{asset.priceUnit}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Valor Total: {typeof asset.totalValue === 'number' ? asset.totalValue.toLocaleString() : 'N/A'} TLC
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 space-y-2">
                      <div className="flex gap-2 w-full">
                        <Link href={`/hire-asset/${asset.id}`} className="flex-1">
                          <Button className="w-full">
                            <Building className="w-4 h-4 mr-2" />
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

              {sortedAssets.length === 0 && (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum ativo encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou termos de busca para encontrar ativos disponíveis.
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
