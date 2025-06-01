"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Coins, ArrowLeft, Wallet, TrendingUp, Clock, DollarSign, Loader2, RefreshCw, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { blockchainService } from "@/lib/blockchain"
import { apiService } from "@/lib/api"
import { ethers } from "ethers"

interface Transaction {
  id: string
  type: "buy" | "sell" | "transfer"
  amount: string
  price: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
  hash?: string
}

export default function Exchange() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [tlcBalance, setTlcBalance] = useState<string>("0")
  const [ethBalance, setEthBalance] = useState<string>("0")
  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tlcPrice] = useState(0.1) // 1 TLC = 0.1 ETH

  useEffect(() => {
    loadWalletData()
    loadTransactionHistory()
  }, [walletAddress])

  const loadWalletData = async () => {
    try {
      if (blockchainService.isConnected()) {
        const address = await blockchainService.getConnectedAddress()
        setWalletAddress(address)

        const tlcBal = await blockchainService.getTLCBalance(address)
        setTlcBalance(tlcBal)

        // Saldo ETH real
        const ethBal = await blockchainService.getETHBalance(address)
        setEthBalance(ethBal)
      }
    } catch (error) {
      console.error("Erro ao carregar dados da carteira:", error)
    }
  }

  const loadTransactionHistory = async () => {
    if (!walletAddress || !window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const history = await provider.send("eth_getLogs", [{
        address: walletAddress,
        fromBlock: "0x0",
        toBlock: "latest"
      }]);
      // Pega as últimas 3 transações enviadas pelo usuário
      const txs = history.slice(-3).reverse().map((log: any, idx: number) => ({
        id: log.transactionHash || idx.toString(),
        type: "transfer", // ou "buy"/"sell" se conseguir identificar
        amount: "-", // Não é possível saber o valor TLC só pelo log genérico
        price: "-",
        timestamp: new Date(), // Não é possível saber o timestamp sem buscar o bloco
        status: "completed",
        hash: log.transactionHash,
      }));
      setTransactions(txs);
    } catch (err) {
      setTransactions([]);
    }
  }

  const connectWallet = async () => {
    try {
      setIsLoading(true)
      const address = await blockchainService.connectWallet()
      setWalletAddress(address)
      await loadWalletData()
      setStatus("✅ Carteira conectada com sucesso!")
    } catch (error) {
      console.error("Erro ao conectar carteira:", error)
      setStatus("❌ Erro ao conectar carteira")
    } finally {
      setIsLoading(false)
    }
  }

  const buyTLC = async () => {
    if (!buyAmount || !walletAddress) return

    setIsLoading(true)
    setProgress(0)

    try {
      setProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular compra de TLC (em produção, usar contrato de exchange)
      setProgress(50)
      const result = await apiService.mintTLC(walletAddress, buyAmount)

      setProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Atualizar saldo
      await loadWalletData()

      setProgress(100)
      setStatus(`✅ Compra realizada: ${buyAmount} TLC`)
      setBuyAmount("")

      // Adicionar transação ao histórico
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "buy",
        amount: buyAmount,
        price: (Number.parseFloat(buyAmount) * tlcPrice).toString(),
        timestamp: new Date(),
        status: "completed",
        hash: "0x" + Math.random().toString(16).substr(2, 8),
      }
      setTransactions([newTransaction, ...transactions])
    } catch (error) {
      console.error("Erro na compra:", error)
      setStatus("❌ Erro na compra de TLC")
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const sellTLC = async () => {
    if (!sellAmount || !walletAddress) return

    setIsLoading(true)
    setProgress(0)

    try {
      setProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar saldo suficiente
      if (Number.parseFloat(tlcBalance) < Number.parseFloat(sellAmount)) {
        throw new Error("Saldo TLC insuficiente")
      }

      setProgress(50)
      // Simular venda de TLC (em produção, usar contrato de exchange)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const result = await apiService.burnTLC(sellAmount)

      setProgress(75)
      await loadWalletData()

      setProgress(100)
      setStatus(`✅ Venda realizada: ${sellAmount} TLC${result.txHash ? ' | TX: ' + result.txHash.slice(0, 10) + '...' : ''}`)
      setSellAmount("")

      // Adicionar transação ao histórico
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "sell",
        amount: sellAmount,
        price: (Number.parseFloat(sellAmount) * tlcPrice).toString(),
        timestamp: new Date(),
        status: "completed",
        hash: "0x" + Math.random().toString(16).substr(2, 8),
      }
      setTransactions([newTransaction, ...transactions])
    } catch (error) {
      console.error("Erro na venda:", error)
      setStatus(`❌ Erro na venda: ${error.message}`)
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const quickBuy = (amount: string) => {
    setBuyAmount(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "buy":
        return "↗️"
      case "sell":
        return "↘️"
      case "transfer":
        return "↔️"
      default:
        return "💱"
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                Exchange TLC
              </h1>
              <p className="text-sm text-muted-foreground">Compre e venda tokens TLC</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trading Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet Connection */}
              {!walletAddress ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Wallet className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Conectar Carteira</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Conecte sua carteira MetaMask para começar a negociar TLC
                    </p>
                    <Button onClick={connectWallet} disabled={isLoading} className="w-full max-w-sm">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 mr-2" />
                          Conectar MetaMask
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Wallet Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Carteira Conectada
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Endereço</p>
                          <p className="font-mono text-sm">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Saldo TLC</p>
                          <p className="text-2xl font-bold text-green-600">
                            {Number.parseFloat(tlcBalance).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Saldo ETH</p>
                          <p className="text-2xl font-bold text-blue-600">{Number.parseFloat(ethBalance).toFixed(4)}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={loadWalletData} className="mt-4">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar Saldos
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Trading Interface */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Buy TLC */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                          <TrendingUp className="w-5 h-5" />
                          Comprar TLC
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="buyAmount">Quantidade TLC</Label>
                          <Input
                            id="buyAmount"
                            type="number"
                            placeholder="1000"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => quickBuy("1000")} disabled={isLoading}>
                            1K
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => quickBuy("5000")} disabled={isLoading}>
                            5K
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => quickBuy("10000")} disabled={isLoading}>
                            10K
                          </Button>
                        </div>

                        {buyAmount && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span>Preço por TLC:</span>
                              <span>{tlcPrice} ETH</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Total:</span>
                              <span className="font-bold">
                                {(Number.parseFloat(buyAmount) * tlcPrice).toFixed(4)} ETH
                              </span>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={buyTLC}
                          disabled={isLoading || !buyAmount}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Comprando...
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-4 h-4 mr-2" />
                              Comprar TLC
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Sell TLC */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <ArrowUpDown className="w-5 h-5" />
                          Vender TLC
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sellAmount">Quantidade TLC</Label>
                          <Input
                            id="sellAmount"
                            type="number"
                            placeholder="500"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSellAmount((Number.parseFloat(tlcBalance) * 0.25).toString())}
                            disabled={isLoading}
                          >
                            25%
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSellAmount((Number.parseFloat(tlcBalance) * 0.5).toString())}
                            disabled={isLoading}
                          >
                            50%
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSellAmount(tlcBalance)}
                            disabled={isLoading}
                          >
                            MAX
                          </Button>
                        </div>

                        {sellAmount && (
                          <div className="p-3 bg-red-50 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span>Preço por TLC:</span>
                              <span>{tlcPrice} ETH</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Você receberá:</span>
                              <span className="font-bold">
                                {(Number.parseFloat(sellAmount) * tlcPrice).toFixed(4)} ETH
                              </span>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={sellTLC}
                          disabled={isLoading || !sellAmount}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Vendendo...
                            </>
                          ) : (
                            <>
                              <ArrowUpDown className="w-4 h-4 mr-2" />
                              Vender TLC
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Progress and Status */}
                  {isLoading && (
                    <Card>
                      <CardContent className="py-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processando transação...</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {status && (
                    <Alert
                      className={status.includes("✅") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                    >
                      <AlertDescription>{status}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>

            {/* Market Info & History */}
            <div className="space-y-6">
              {/* Market Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Informações do Mercado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Preço TLC/ETH:</span>
                      <span className="font-medium">{tlcPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Variação 24h:</span>
                      <span className="font-medium text-green-600">+2.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Volume 24h:</span>
                      <span className="font-medium">125,000 TLC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Market Cap:</span>
                      <span className="font-medium">$2.5M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Histórico de Transações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Nenhuma transação encontrada</p>
                    ) : (
                      transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getTypeIcon(tx.type)}</span>
                            <div>
                              <p className="font-medium capitalize">{tx.type}</p>
                              <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleTimeString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{tx.amount} TLC</p>
                            <p className={`text-xs ${getStatusColor(tx.status)}`}>{tx.status}</p>
                          </div>
                        </div>
                      ))
                    )}
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
