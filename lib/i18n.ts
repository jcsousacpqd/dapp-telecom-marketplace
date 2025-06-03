export type Lang = 'pt' | 'en' | 'es' | 'fr';
export interface Translation {
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

export const translations: Record<Lang, Translation> = {
  pt: {
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
  },
  en: {
    connectWallet: "Connect Wallet",
    startMarketplace: "Start Marketplace",
    searchPlaceholder: "Search for towers, antennas, spectrum...",
    welcome: "Welcome to D-MTS",
    selectProfile: "Select your profile to continue",
    dashboard: "Dashboard",
    exchange: "Exchange TLC",
    assets: "View Assets",
    services: "View Services",
    publishAsset: "Publish Asset",
    publishService: "Publish Service",
    registerIdentity: "DID Identity",
    adminPanel: "Admin Panel",
    quickAccess: "Quick Access",
    manageAssets: "Manage your assets, services and contracts in a decentralized way",
    categories: "Categories",
    networkStatus: "Network Status",
    blockchain: "Blockchain",
    online: "Online",
    blocks: "Blocks",
    activeNodes: "Active Nodes",
    contracts: "Contracts",
    networkUsage: "Network Usage",
    highlights: "Highlights",
    priceLow: "Price: Low to High",
    priceHigh: "Price: High to Low",
    newest: "Newest",
    availability: "Availability",
    allItems: "All Items",
    infrastructure: "Infrastructure",
    equipment: "Equipment",
    connectivity: "Connectivity",
    licenses: "Licenses",
    service: "Services",
    foundItems: (n: number) => `${n} items found`,
    infraAssets: "Infrastructure Assets",
    telecomServices: "Telecom Services",
    hireAsset: "Hire Asset",
    hireService: "Hire Service",
    requiredAssets: "Required Assets:",
    totalValue: "Total Value:",
    location: "Location:",
    duration: "Duration:",
    contractType: "Contract Type",
    tokenized: "Tokenized",
    verified: "Verified",
    smartContracts: "Smart Contracts",
    activeContracts: "Active Contracts",
    myAssets: "My Assets",
    myServices: "My Services",
    myBalance: "My Balance",
    availableBalance: "Available Balance",
    locked: "Locked in contracts",
    nextPayment: "Next payment",
    addFunds: "Add Funds",
    recentActivity: "Recent Activity",
    connectToAccess: "To access the decentralized marketplace, you need to connect your digital wallet and create your decentralized identity (DID).",
  },
  es: {
    connectWallet: "Conectar Billetera",
    startMarketplace: "Iniciar el Marketplace",
    searchPlaceholder: "Buscar torres, antenas, espectro...",
    welcome: "Bienvenido a D-MTS",
    selectProfile: "Seleccione su perfil para continuar",
    dashboard: "Panel",
    exchange: "Intercambiar TLC",
    assets: "Ver Activos",
    services: "Ver Servicios",
    publishAsset: "Publicar Activo",
    publishService: "Publicar Servicio",
    registerIdentity: "Identidad DID",
    adminPanel: "Panel Admin",
    quickAccess: "Acceso Rápido",
    manageAssets: "Gestione sus activos, servicios y contratos de forma descentralizada",
    categories: "Categorías",
    networkStatus: "Estado de la Red",
    blockchain: "Blockchain",
    online: "En línea",
    blocks: "Bloques",
    activeNodes: "Nodos Activos",
    contracts: "Contratos",
    networkUsage: "Uso de la Red",
    highlights: "Destacados",
    priceLow: "Precio: Menor a Mayor",
    priceHigh: "Precio: Mayor a Menor",
    newest: "Más Recientes",
    availability: "Disponibilidad",
    allItems: "Todos los Ítems",
    infrastructure: "Infraestructura",
    equipment: "Equipos",
    connectivity: "Conectividad",
    licenses: "Licencias",
    service: "Servicios",
    foundItems: (n: number) => `${n} ítems encontrados`,
    infraAssets: "Activos de Infraestructura",
    telecomServices: "Servicios de Telecomunicaciones",
    hireAsset: "Contratar Activo",
    hireService: "Contratar Servicio",
    requiredAssets: "Activos Requeridos:",
    totalValue: "Valor Total:",
    location: "Ubicación:",
    duration: "Duración:",
    contractType: "Tipo de Contrato",
    tokenized: "Tokenizado",
    verified: "Verificado",
    smartContracts: "Smart Contracts",
    activeContracts: "Contratos Activos",
    myAssets: "Mis Activos",
    myServices: "Mis Servicios",
    myBalance: "Mi Saldo",
    availableBalance: "Saldo Disponible",
    locked: "Bloqueado en contratos",
    nextPayment: "Próximo pago",
    addFunds: "Agregar Fondos",
    recentActivity: "Actividad Reciente",
    connectToAccess: "Para acceder al marketplace descentralizado, debe conectar su billetera digital y crear su identidad descentralizada (DID).",
  },
  fr: {
    connectWallet: "Connecter le Portefeuille",
    startMarketplace: "Démarrer le Marketplace",
    searchPlaceholder: "Rechercher des tours, antennes, spectre...",
    welcome: "Bienvenue sur D-MTS",
    selectProfile: "Sélectionnez votre profil pour continuer",
    dashboard: "Tableau de bord",
    exchange: "Échanger TLC",
    assets: "Voir les Actifs",
    services: "Voir les Services",
    publishAsset: "Publier un Actif",
    publishService: "Publier un Service",
    registerIdentity: "Identité DID",
    adminPanel: "Panneau Admin",
    quickAccess: "Accès Rapide",
    manageAssets: "Gérez vos actifs, services et contrats de manière décentralisée",
    categories: "Catégories",
    networkStatus: "Statut du Réseau",
    blockchain: "Blockchain",
    online: "En ligne",
    blocks: "Blocs",
    activeNodes: "Nœuds Actifs",
    contracts: "Contrats",
    networkUsage: "Utilisation du Réseau",
    highlights: "À la une",
    priceLow: "Prix : Croissant",
    priceHigh: "Prix : Décroissant",
    newest: "Les plus récents",
    availability: "Disponibilité",
    allItems: "Tous les éléments",
    infrastructure: "Infrastructure",
    equipment: "Équipements",
    connectivity: "Connectivité",
    licenses: "Licences",
    service: "Services",
    foundItems: (n: number) => `${n} éléments trouvés`,
    infraAssets: "Actifs d'Infrastructure",
    telecomServices: "Services de Télécommunications",
    hireAsset: "Louer l'Actif",
    hireService: "Louer le Service",
    requiredAssets: "Actifs Requis :",
    totalValue: "Valeur Totale :",
    location: "Emplacement :",
    duration: "Durée :",
    contractType: "Type de Contrat",
    tokenized: "Tokenisé",
    verified: "Vérifié",
    smartContracts: "Smart Contracts",
    activeContracts: "Contrats Actifs",
    myAssets: "Mes Actifs",
    myServices: "Mes Services",
    myBalance: "Mon Solde",
    availableBalance: "Solde Disponible",
    locked: "Bloqué dans des contrats",
    nextPayment: "Prochain paiement",
    addFunds: "Ajouter des Fonds",
    recentActivity: "Activité Récente",
    connectToAccess: "Pour accéder au marketplace décentralisé, vous devez connecter votre portefeuille numérique et créer votre identité décentralisée (DID).",
  },
}; 