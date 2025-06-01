"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ethers } from "ethers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Copy, CheckCircle, AlertTriangle, Key, Shield, Database, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState("")
  const [networkName, setNetworkName] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [newWallet, setNewWallet] = useState<{
    address: string
    privateKey: string
    mnemonic: string
  } | null>(null)
  const [copied, setCopied] = useState("")
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask não encontrada! Por favor, instale a extensão.")
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      setWalletAddress(address)
      setNetworkName("Hyperledger Besu Local")
      setIsConnected(true)
    } catch (error) {
      console.error("Erro ao conectar carteira:", error)
      alert("Falha ao conectar com a carteira")
    }
  }

  const createWallet = () => {
    const wallet = ethers.Wallet.createRandom()
    setNewWallet({
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    })
  }

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(""), 2000)
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Conectar Carteira
              </h1>
              <p className="text-sm text-muted-foreground">Gerencie sua identidade digital</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="connect" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connect">Conectar MetaMask</TabsTrigger>
              <TabsTrigger value="create">Criar Nova Carteira</TabsTrigger>
            </TabsList>

            <TabsContent value="connect" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Conectar com MetaMask
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConnected ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Wallet className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Conecte sua carteira MetaMask</h3>
                        <p className="text-muted-foreground">
                          Para acessar o marketplace descentralizado, você precisa conectar sua carteira MetaMask.
                        </p>
                      </div>
                      <Button onClick={connectWallet} size="lg" className="w-full max-w-sm">
                        <Wallet className="w-5 h-5 mr-2" />
                        Conectar MetaMask
                      </Button>
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Certifique-se de que está conectado à rede Hyperledger Besu para usar o marketplace.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>Carteira conectada com sucesso!</AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Rede Conectada</Label>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Database className="w-3 h-3 mr-1" />
                              {networkName}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Conectado
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Endereço da Carteira</Label>
                        <div className="flex gap-2">
                          <Input value={walletAddress} readOnly className="font-mono" />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(walletAddress, "address")}
                          >
                            {copied === "address" ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Link href="/register-identity" className="flex-1">
                          <Button className="w-full">
                            <Key className="w-4 h-4 mr-2" />
                            Registrar Identidade DID
                          </Button>
                        </Link>
                        <Link href="/dashboard" className="flex-1">
                          <Button variant="outline" className="w-full">
                            Voltar ao Dashboard
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Criar Nova Carteira
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!newWallet ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Key className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Não tem uma carteira?</h3>
                        <p className="text-muted-foreground">
                          Crie uma nova carteira Ethereum para começar a usar o marketplace.
                        </p>
                      </div>
                      <Button onClick={createWallet} size="lg" className="w-full max-w-sm">
                        <Key className="w-5 h-5 mr-2" />
                        Criar Nova Carteira
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Importante:</strong> Guarde essas informações com segurança! Você precisará delas para
                          importar a carteira no MetaMask.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Endereço da Carteira</Label>
                          <div className="flex gap-2">
                            <Input value={newWallet.address} readOnly className="font-mono" />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(newWallet.address, "newAddress")}
                            >
                              {copied === "newAddress" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Chave Privada</Label>
                          <div className="flex gap-2">
                            <Input value={newWallet.privateKey} readOnly className="font-mono" type="password" />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(newWallet.privateKey, "privateKey")}
                            >
                              {copied === "privateKey" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Frase Mnemônica (Seed Phrase)</Label>
                          <div className="flex gap-2">
                            <Input value={newWallet.mnemonic} readOnly className="font-mono" />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(newWallet.mnemonic, "mnemonic")}
                            >
                              {copied === "mnemonic" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Como importar no MetaMask:
                        </h4>
                        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                          <li>Abra a extensão MetaMask</li>
                          <li>Clique no ícone da conta e selecione "Importar Conta"</li>
                          <li>Cole a chave privada ou use a frase mnemônica</li>
                          <li>Confirme a importação</li>
                        </ol>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir MetaMask
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
