// Contract configurations and ABIs
export const CONTRACTS = {
  TELECOIN: {
    address: process.env.NEXT_PUBLIC_TELECOIN_ADDRESS!,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "initialOwner",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "allowance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Paused",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Unpaused",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "burnFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "paused",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
  },
  ASSETS: {
    address: process.env.NEXT_PUBLIC_ASSETS_ADDRESS!,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractTLC",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_contractOwnerTLC",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "renter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "slices",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "AssetHired",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "supplier",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "slices",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "totalPrice",
            "type": "uint256"
          }
        ],
        "name": "AssetRegistered",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "slices",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "monthsAvailable",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pricePerSlice",
            "type": "uint256"
          }
        ],
        "name": "CreateAssetsRegistry",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "slices",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "callerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "_hireAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "renterAddress",
            "type": "address"
          }
        ],
        "name": "checkOpenStatus",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "contractCreatedAt",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "contractOwnerTLC",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "contractTLC",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          }
        ],
        "name": "getAssets",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "supplier",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "startOffer",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "amountPerSlices",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "slices",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "initialSlices",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "availability",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "pricePerSlice",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "registered",
                "type": "bool"
              },
              {
                "internalType": "enum Status",
                "name": "status",
                "type": "uint8"
              }
            ],
            "internalType": "struct AssetsMetadata",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          }
        ],
        "name": "getAssetsStatus",
        "outputs": [
          {
            "internalType": "enum Status",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "getRenter",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "assetId",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "renterAddress",
            "type": "address"
          }
        ],
        "name": "getRenterDetails",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "renter",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "slice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "startRent",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lockedValue",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "openStatus",
                "type": "bool"
              },
              {
                "internalType": "address",
                "name": "hireAddress",
                "type": "address"
              }
            ],
            "internalType": "struct Renters",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          }
        ],
        "name": "getSupplier",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "token",
        "outputs": [
          {
            "internalType": "contract IERC20",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "renterAddress",
            "type": "address"
          }
        ],
        "name": "updateRenterDetails",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
  },
  SERVICES: {
    address: process.env.NEXT_PUBLIC_SERVICES_ADDRESS!,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_assetsContractAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_contractTLC",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "supplier",
            "type": "address"
          }
        ],
        "name": "RegisteredService",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "ServiceHired",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "serviceId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "monthsAvailable",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "finalPrice",
            "type": "uint256"
          }
        ],
        "name": "CreateServiceRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "serviceId",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "assetIds",
            "type": "string[]"
          },
          {
            "internalType": "uint256[]",
            "name": "slices",
            "type": "uint256[]"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "monthsAvailable",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "finalPrice",
            "type": "uint256"
          }
        ],
        "name": "CreateServiceRecordWithAssets",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "serviceId",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "callerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "_hireService",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "assetsContract",
        "outputs": [
          {
            "internalType": "contract AssetsContract",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "renterAddress",
            "type": "address"
          }
        ],
        "name": "checkServiceOpenStatus",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "contractService",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          }
        ],
        "name": "getProvider",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "serviceId",
            "type": "string"
          }
        ],
        "name": "getservice",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "serviceId",
                "type": "string"
              },
              {
                "internalType": "string[]",
                "name": "assetIds",
                "type": "string[]"
              },
              {
                "internalType": "address",
                "name": "supplier",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "startOffer",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "availability",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "initialPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalPrice",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "registered",
                "type": "bool"
              },
              {
                "internalType": "enum ServiceStatus",
                "name": "status",
                "type": "uint8"
              }
            ],
            "internalType": "struct ServicesMetadata",
            "name": "servicesMetadata",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "serviceId",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "renterAddress",
            "type": "address"
          }
        ],
        "name": "getserviceHired",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "renter",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "startRent",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lockedValue",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "openStatus",
                "type": "bool"
              },
              {
                "internalType": "address",
                "name": "hireAddress",
                "type": "address"
              }
            ],
            "internalType": "struct ServiceRenters",
            "name": "serviceRenters",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "token",
        "outputs": [
          {
            "internalType": "contract IERC20",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "renterAddress",
            "type": "address"
          }
        ],
        "name": "updateRenterDetails",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
  },
  HIRE_ASSET: {
    address: process.env.NEXT_PUBLIC_HIRE_ASSET_ADDRESS!,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_serviceContractAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_contractTLC",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "renter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "payment",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "refund",
            "type": "uint256"
          }
        ],
        "name": "PaymentMade",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "assetsContract",
        "outputs": [
          {
            "internalType": "contract AssetsContract",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "slices",
            "type": "uint256"
          }
        ],
        "name": "hireAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "renterAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "payment",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "refund",
            "type": "uint256"
          }
        ],
        "name": "payAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "token",
        "outputs": [
          {
            "internalType": "contract IERC20",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
  },
  HIRE_SERVICE: {
    address: process.env.NEXT_PUBLIC_HIRE_SERVICE_ADDRESS!,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_ServiceContractAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_contractTLC",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "renter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "payment",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "refund",
            "type": "uint256"
          }
        ],
        "name": "PaymentMade",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "serviceId",
            "type": "string"
          }
        ],
        "name": "hireService",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "Id",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "renterAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "payment",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "refund",
            "type": "uint256"
          }
        ],
        "name": "payService",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "serviceContract",
        "outputs": [
          {
            "internalType": "contract ServiceContract",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "token",
        "outputs": [
          {
            "internalType": "contract IERC20",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
  },
  DID_REGISTRY: {
    address: process.env.NEXT_PUBLIC_INDY_DID_REGISTRY!,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "target",
            "type": "address"
          }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "did",
            "type": "string"
          }
        ],
        "name": "DidAlreadyExist",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "did",
            "type": "string"
          }
        ],
        "name": "DidHasBeenDeactivated",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "did",
            "type": "string"
          }
        ],
        "name": "DidNotFound",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "ERC1967InvalidImplementation",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "ERC1967NonPayable",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          }
        ],
        "name": "SenderIsNotCreator",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "UUPSUnauthorizedCallContext",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "slot",
            "type": "bytes32"
          }
        ],
        "name": "UUPSUnsupportedProxiableUUID",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "did",
            "type": "string"
          }
        ],
        "name": "DIDCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "did",
            "type": "string"
          }
        ],
        "name": "DIDDeactivated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "did",
            "type": "string"
          }
        ],
        "name": "DIDUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint64",
            "name": "version",
            "type": "uint64"
          }
        ],
        "name": "Initialized",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "Upgraded",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "UPGRADE_INTERFACE_VERSION",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "string[]",
                "name": "context",
                "type": "string[]"
              },
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "string[]",
                "name": "controller",
                "type": "string[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "verificationMethodType",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "controller",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "publicKeyJwk",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "publicKeyMultibase",
                    "type": "string"
                  }
                ],
                "internalType": "struct VerificationMethod[]",
                "name": "verificationMethod",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "authentication",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "assertionMethod",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "capabilityInvocation",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "capabilityDelegation",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "keyAgreement",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "serviceType",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "serviceEndpoint",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "accept",
                    "type": "string[]"
                  },
                  {
                    "internalType": "string[]",
                    "name": "routingKeys",
                    "type": "string[]"
                  }
                ],
                "internalType": "struct Service[]",
                "name": "service",
                "type": "tuple[]"
              },
              {
                "internalType": "string[]",
                "name": "alsoKnownAs",
                "type": "string[]"
              }
            ],
            "internalType": "struct DidDocument",
            "name": "document",
            "type": "tuple"
          }
        ],
        "name": "createDid",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "deactivateDid",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "upgradeControlAddress",
            "type": "address"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "proxiableUUID",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "resolveDid",
        "outputs": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "string[]",
                    "name": "context",
                    "type": "string[]"
                  },
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "controller",
                    "type": "string[]"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod[]",
                    "name": "verificationMethod",
                    "type": "tuple[]"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "components": [
                          {
                            "internalType": "string",
                            "name": "id",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "verificationMethodType",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "controller",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyJwk",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyMultibase",
                            "type": "string"
                          }
                        ],
                        "internalType": "struct VerificationMethod",
                        "name": "verificationMethod",
                        "type": "tuple"
                      }
                    ],
                    "internalType": "struct VerificationRelationship[]",
                    "name": "authentication",
                    "type": "tuple[]"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "components": [
                          {
                            "internalType": "string",
                            "name": "id",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "verificationMethodType",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "controller",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyJwk",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyMultibase",
                            "type": "string"
                          }
                        ],
                        "internalType": "struct VerificationMethod",
                        "name": "verificationMethod",
                        "type": "tuple"
                      }
                    ],
                    "internalType": "struct VerificationRelationship[]",
                    "name": "assertionMethod",
                    "type": "tuple[]"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "components": [
                          {
                            "internalType": "string",
                            "name": "id",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "verificationMethodType",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "controller",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyJwk",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyMultibase",
                            "type": "string"
                          }
                        ],
                        "internalType": "struct VerificationMethod",
                        "name": "verificationMethod",
                        "type": "tuple"
                      }
                    ],
                    "internalType": "struct VerificationRelationship[]",
                    "name": "capabilityInvocation",
                    "type": "tuple[]"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "components": [
                          {
                            "internalType": "string",
                            "name": "id",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "verificationMethodType",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "controller",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyJwk",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyMultibase",
                            "type": "string"
                          }
                        ],
                        "internalType": "struct VerificationMethod",
                        "name": "verificationMethod",
                        "type": "tuple"
                      }
                    ],
                    "internalType": "struct VerificationRelationship[]",
                    "name": "capabilityDelegation",
                    "type": "tuple[]"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "components": [
                          {
                            "internalType": "string",
                            "name": "id",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "verificationMethodType",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "controller",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyJwk",
                            "type": "string"
                          },
                          {
                            "internalType": "string",
                            "name": "publicKeyMultibase",
                            "type": "string"
                          }
                        ],
                        "internalType": "struct VerificationMethod",
                        "name": "verificationMethod",
                        "type": "tuple"
                      }
                    ],
                    "internalType": "struct VerificationRelationship[]",
                    "name": "keyAgreement",
                    "type": "tuple[]"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "serviceType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "serviceEndpoint",
                        "type": "string"
                      },
                      {
                        "internalType": "string[]",
                        "name": "accept",
                        "type": "string[]"
                      },
                      {
                        "internalType": "string[]",
                        "name": "routingKeys",
                        "type": "string[]"
                      }
                    ],
                    "internalType": "struct Service[]",
                    "name": "service",
                    "type": "tuple[]"
                  },
                  {
                    "internalType": "string[]",
                    "name": "alsoKnownAs",
                    "type": "string[]"
                  }
                ],
                "internalType": "struct DidDocument",
                "name": "document",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "created",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "updated",
                    "type": "uint256"
                  },
                  {
                    "internalType": "bool",
                    "name": "deactivated",
                    "type": "bool"
                  }
                ],
                "internalType": "struct DidMetadata",
                "name": "metadata",
                "type": "tuple"
              }
            ],
            "internalType": "struct DidDocumentStorage",
            "name": "didDocumentStorage",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "string[]",
                "name": "context",
                "type": "string[]"
              },
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "string[]",
                "name": "controller",
                "type": "string[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "verificationMethodType",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "controller",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "publicKeyJwk",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "publicKeyMultibase",
                    "type": "string"
                  }
                ],
                "internalType": "struct VerificationMethod[]",
                "name": "verificationMethod",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "authentication",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "assertionMethod",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "capabilityInvocation",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "capabilityDelegation",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "components": [
                      {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "verificationMethodType",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "controller",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyJwk",
                        "type": "string"
                      },
                      {
                        "internalType": "string",
                        "name": "publicKeyMultibase",
                        "type": "string"
                      }
                    ],
                    "internalType": "struct VerificationMethod",
                    "name": "verificationMethod",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct VerificationRelationship[]",
                "name": "keyAgreement",
                "type": "tuple[]"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "serviceType",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "serviceEndpoint",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "accept",
                    "type": "string[]"
                  },
                  {
                    "internalType": "string[]",
                    "name": "routingKeys",
                    "type": "string[]"
                  }
                ],
                "internalType": "struct Service[]",
                "name": "service",
                "type": "tuple[]"
              },
              {
                "internalType": "string[]",
                "name": "alsoKnownAs",
                "type": "string[]"
              }
            ],
            "internalType": "struct DidDocument",
            "name": "document",
            "type": "tuple"
          }
        ],
        "name": "updateDid",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newImplementation",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "upgradeToAndCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ],
  },
  SCHEMA_REGISTRY: {
    address: process.env.NEXT_PUBLIC_SCHEMA_REGISTRY!,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "target",
            "type": "address"
          }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "ERC1967InvalidImplementation",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "ERC1967NonPayable",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "name": "FieldRequired",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "InvalidIssuerId",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "InvalidSchemaId",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "IssuerHasBeenDeactivated",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "IssuerNotFound",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "PackedPtrLen__LenOverflow",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "PackedPtrLen__PtrOverflow",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "SchemaAlreadyExist",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "SchemaNotFound",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "SenderIsNotIssuerDidOwner",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "UUPSUnauthorizedCallContext",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "slot",
            "type": "bytes32"
          }
        ],
        "name": "UUPSUnsupportedProxiableUUID",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint64",
            "name": "version",
            "type": "uint64"
          }
        ],
        "name": "Initialized",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "schemaId",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "SchemaCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "Upgraded",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "UPGRADE_INTERFACE_VERSION",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "issuerId",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "version",
                "type": "string"
              },
              {
                "internalType": "string[]",
                "name": "attrNames",
                "type": "string[]"
              }
            ],
            "internalType": "struct Schema",
            "name": "schema",
            "type": "tuple"
          }
        ],
        "name": "createSchema",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "upgradeControlAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "didResolverAddress",
            "type": "address"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "proxiableUUID",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "resolveSchema",
        "outputs": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "issuerId",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "version",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "attrNames",
                    "type": "string[]"
                  }
                ],
                "internalType": "struct Schema",
                "name": "schema",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "created",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct SchemaMetadata",
                "name": "metadata",
                "type": "tuple"
              }
            ],
            "internalType": "struct SchemaWithMetadata",
            "name": "schemaWithMetadata",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newImplementation",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "upgradeToAndCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ],
  },

  CREDENTIAL_DEFINITION_REGISTRY: {
    address: process.env.NEXT_PUBLIC_CREDENTIAL_DEFINITION_REGISTRY!,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "target",
            "type": "address"
          }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "CredentialDefinitionAlreadyExist",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "CredentialDefinitionNotFound",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "ERC1967InvalidImplementation",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "ERC1967NonPayable",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "name": "FieldRequired",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "InvalidIssuerId",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "IssuerHasBeenDeactivated",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "IssuerNotFound",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "PackedPtrLen__LenOverflow",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "PackedPtrLen__PtrOverflow",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "SenderIsNotIssuerDidOwner",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "UUPSUnauthorizedCallContext",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "slot",
            "type": "bytes32"
          }
        ],
        "name": "UUPSUnsupportedProxiableUUID",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "credDefType",
            "type": "string"
          }
        ],
        "name": "UnsupportedCredentialDefinitionType",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "credentialDefinitionId",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "CredentialDefinitionCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint64",
            "name": "version",
            "type": "uint64"
          }
        ],
        "name": "Initialized",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "Upgraded",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "UPGRADE_INTERFACE_VERSION",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "issuerId",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "schemaId",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "credDefType",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tag",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "value",
                "type": "string"
              }
            ],
            "internalType": "struct CredentialDefinition",
            "name": "credDef",
            "type": "tuple"
          }
        ],
        "name": "createCredentialDefinition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "upgradeControlAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "didResolverAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "schemaRegistryAddress",
            "type": "address"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "proxiableUUID",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "resolveCredentialDefinition",
        "outputs": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "id",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "issuerId",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "schemaId",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "credDefType",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "tag",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "value",
                    "type": "string"
                  }
                ],
                "internalType": "struct CredentialDefinition",
                "name": "credDef",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "created",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct CredentialDefinitionMetadata",
                "name": "metadata",
                "type": "tuple"
              }
            ],
            "internalType": "struct CredentialDefinitionWithMetadata",
            "name": "credDefWithMetadata",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newImplementation",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "upgradeToAndCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ],
  },
} as const

export type ContractName = keyof typeof CONTRACTS
