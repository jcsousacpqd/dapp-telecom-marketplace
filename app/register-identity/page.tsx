"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ethers } from "ethers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { User, Shield, Key, ArrowLeft, Database, Search, Loader2, CheckCircle, Users } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api"
import { blockchainService } from "@/lib/blockchain"
import { CONTRACTS } from "@/lib/contracts"


const userRoles = [
  {
    value: "asset-provider",
    label: "Provedor de Ativos",
    description: "Publique e gerencie infraestrutura física de telecomunicações",
    icon: "🏗️",
    color: "bg-orange-500",
    permissions: ["Publicar ativos", "Gerenciar contratos", "Receber pagamentos"],
  },
  {
    value: "service-provider",
    label: "Provedor de Serviços",
    description: "Ofereça serviços técnicos e operacionais de telecomunicações",
    icon: "🛠️",
    color: "bg-cyan-500",
    permissions: ["Publicar serviços", "Usar ativos do marketplace", "Gerenciar SLAs"],
  },
  {
    value: "client",
    label: "Cliente",
    description: "Contrate ativos e serviços de telecomunicações",
    icon: "👤",
    color: "bg-blue-500",
    permissions: ["Contratar ativos", "Contratar serviços", "Avaliar provedores"],
  },
]

export default function RegisterIdentity() {
  const [form, setForm] = useState({ name: "", role: "" })
  const [status, setStatus] = useState<string | null>(null)
  const [queryResult, setQueryResult] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isQuerying, setIsQuerying] = useState(false)
  const [registrationProgress, setRegistrationProgress] = useState(0)

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleRegister = async () => {
    if (!form.name || !form.role) {
      alert("Por favor, preencha todos os campos")
      return
    }

    setIsRegistering(true)
    setRegistrationProgress(0)

    try {

      if (!window.ethereum) return alert('Wallet não detectada');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      // Criação do DID
      const did = `${address.slice(2, 24)}`;
      const fullDid = `did:indy2:indy_besu:${did}`;

      let alreadyRegistered = false;
      try {
        const result = await blockchainService.getDID(fullDid);
        alreadyRegistered = result[1] !== ethers.ZeroAddress;
      } catch {
        console.warn(`DID ${fullDid} não encontrado.`);
      }

      setRegistrationProgress(20)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (alreadyRegistered) {
        setStatus(`⚠️ Identidade já registrada com o DID: ${fullDid}`);
        return;
      }
      setRegistrationProgress(40)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const didTx = await blockchainService.registerDID(fullDid, did);

      // Criação do Schema
      const schema = [
        `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`,
        fullDid,
        `Mkt${did}`,
        `${did}`,
        [`${form.name}`, `${form.role}`]
      ];
      const schemaRegistry = await blockchainService.registerSchema(fullDid, did, form.name, form.role);


      setRegistrationProgress(60)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Criação da Credential Definition

      const credDefRegistry = await blockchainService.registerCredDef(fullDid, did, form.name, form.role);

      setRegistrationProgress(80)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular confirmação na blockchain
      setRegistrationProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStatus(`✅ Identidade registrada com sucesso! DID: ${did}`);
      setForm({ name: "", role: "" })
    } catch (err) {
      console.error(err)
      setStatus("❌ Erro ao registrar identidade.")
    } finally {
      setIsRegistering(false)
      setRegistrationProgress(0)
    }
  }

  const handleCheckIdentity = async () => {
    setIsQuerying(true)
    try {
      if (!window.ethereum) return alert('Wallet não detectada');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const did = `${address.slice(2, 24)}`;
      const fullSchema = `did:indy2:indy_besu:${did}/anoncreds/v0/SCHEMA/Mkt${did}/${did}`;
      const contract = new ethers.Contract(CONTRACTS.SCHEMA_REGISTRY.address, CONTRACTS.SCHEMA_REGISTRY.abi, signer)
      console.log(fullSchema)
      const schemaVerify = await contract.resolveSchema(fullSchema)
      const attrs = schemaVerify[0][4]; // name, role
      setQueryResult(`👤 Nome: ${attrs[0]} | 📛 Perfil: ${attrs[1]}`);
    } catch (err) {
      console.error(err);
      setQueryResult("❌ Nenhuma identidade encontrada para esta carteira.");
    } finally {
      setIsQuerying(false)
    }
  }

  const selectedRoleData = userRoles.find((role) => role.value === form.role)

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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                Identidade Descentralizada
              </h1>
              <p className="text-sm text-muted-foreground">Registre e gerencie sua identidade DID</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Registro de Identidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Registrar Nova Identidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Sua identidade será registrada na blockchain usando tecnologia DID (Decentralized Identity) com
                    contratos inteligentes.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="Digite seu nome completo"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={isRegistering}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Tipo de Perfil</Label>
                    <Select
                      value={form.role}
                      onValueChange={(value) => handleChange("role", value)}
                      disabled={isRegistering}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu perfil..." />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center gap-2">
                              <span>{role.icon}</span>
                              <span>{role.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedRoleData && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 ${selectedRoleData.color} rounded-xl flex items-center justify-center`}
                        >
                          <span className="text-2xl">{selectedRoleData.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{selectedRoleData.label}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{selectedRoleData.description}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Permissões incluídas:</p>
                            {selectedRoleData.permissions.map((permission, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-xs">{permission}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isRegistering && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Registrando identidade...</span>
                        <span>{registrationProgress}%</span>
                      </div>
                      <Progress value={registrationProgress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {registrationProgress < 20 && "Verificando carteira conectada..."}
                        {registrationProgress >= 20 && registrationProgress < 40 && "Criando DID na blockchain..."}
                        {registrationProgress >= 40 &&
                          registrationProgress < 60 &&
                          "Registrando schema de identidade..."}
                        {registrationProgress >= 60 &&
                          registrationProgress < 80 &&
                          "Criando definição de credencial..."}
                        {registrationProgress >= 80 && "Confirmando transações..."}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering || !form.name || !form.role}
                    className="w-full"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Criar Identidade
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
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Como funciona o DID:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Sua identidade é registrada na blockchain Hyperledger Besu</li>
                    <li>• Você mantém controle total sobre seus dados</li>
                    <li>• Verificação criptográfica automática</li>
                    <li>• Interoperabilidade entre diferentes plataformas</li>
                    <li>• Contratos inteligentes garantem autenticidade</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Consulta de Identidade */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Consultar Identidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Verificar Identidade Existente</h3>
                      <p className="text-muted-foreground">
                        Use sua carteira conectada para verificar qual perfil está associado ao seu DID.
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleCheckIdentity} disabled={isQuerying} className="w-full" variant="outline">
                    {isQuerying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Consultando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Verificar Minha Identidade
                      </>
                    )}
                  </Button>

                  {queryResult && (
                    <Alert
                      className={
                        queryResult.includes("❌") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                      }
                    >
                      <AlertDescription>{queryResult}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-semibold">Informações da Carteira Conectada:</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Endereço</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          0x71C7...976F
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rede</span>
                        <Badge variant="outline" className="text-green-600">
                          Hyperledger Besu
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status DID</span>
                        <Badge variant="outline" className="text-blue-600">
                          Verificando...
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Sua identidade é verificada automaticamente através de contratos inteligentes na blockchain.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Tipos de Perfil */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Tipos de Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userRoles.map((role) => (
                      <div key={role.value} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div
                          className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="text-lg">{role.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{role.label}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 2).map((permission, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{role.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
