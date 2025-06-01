"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { blockchainService } from "@/lib/blockchain"

interface WalletConnectorProps {
  onConnect?: (address: string) => void
  onDisconnect?: () => void
  showBalance?: boolean
}

export function WalletConnector({ onConnect, onDisconnect, showBalance = true }: WalletConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [tlcBalance, setTlcBalance] = useState<string>("0")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      if (blockchainService.isConnected()) {
        const address = await blockchainService.getConnectedAddress()
        setWalletAddress(address)
        if (showBalance) {
          const balance = await blockchainService.getTLCBalance(address)
          setTlcBalance(balance)
        }
        onConnect?.(address)
      }
    } catch (error) {
      console.error("Erro ao verificar conexão:", error)
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError("")

    try {
      const address = await blockchainService.connectWallet()
      setWalletAddress(address)

      if (showBalance) {
        const balance = await blockchainService.getTLCBalance(address)
        setTlcBalance(balance)
      }

      onConnect?.(address)
    } catch (error: any) {
      setError(error.message || "Erro ao conectar carteira")
      console.error("Erro ao conectar carteira:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress("")
    setTlcBalance("0")
    setError("")
    onDisconnect?.()
  }

  if (walletAddress) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Carteira Conectada</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            </div>
            <div className="text-right">
              {showBalance && (
                <Badge variant="secondary" className="mb-2">
                  {Number.parseFloat(tlcBalance).toFixed(2)} TLC
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={disconnectWallet}>
                Desconectar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">Conectar Carteira</h3>
            <p className="text-sm text-muted-foreground">Conecte sua carteira MetaMask para acessar o marketplace</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
            {isConnecting ? (
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
        </div>
      </CardContent>
    </Card>
  )
}
