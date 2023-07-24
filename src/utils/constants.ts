import { IAsset, IChain, ILP, IMetadataOfAsset, IToken } from "./interfaces";

export const TEMP_CRYPTO_LOGO_URL =
  "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025";

export const TEMP_CHAINS: Array<IChain> = [
  {
    id: 1,
    name: "Solana",
    imgSrc: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025"
  },
  {
    id: 2,
    name: "Aptos",
    imgSrc: "https://cryptologos.cc/logos/aptos-apt-logo.svg?v=025"
  },
  {
    id: 3,
    name: "Ethereum",
    imgSrc: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025"
  },
  {
    id: 4,
    name: "Fantom",
    imgSrc: "https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=025"
  },
  {
    id: 5,
    name: "BSC",
    imgSrc: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025"
  },
  {
    id: 6,
    name: "Polygon",
    imgSrc: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025"
  }
];

export const TEMP_TOKENS: Array<IToken> = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    imgSrc: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025",
    depositedAmount: 0
  },
  {
    id: 2,
    name: "BNB",
    symbol: "BNB",
    imgSrc: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025",
    depositedAmount: 0
  },
  {
    id: 3,
    name: "USD Coin",
    symbol: "USDC",
    imgSrc: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025",
    depositedAmount: 0
  },
  {
    id: 4,
    name: "Ethereum",
    symbol: "ETH",
    imgSrc: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
    depositedAmount: 0
  },
  {
    id: 5,
    name: "Solana",
    symbol: "SOL",
    imgSrc: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025",
    depositedAmount: 0
  }
];

export const TEMP_WALLET_ADDRESS =
  "0xbee86614d7b0017fd77e07ee2b3c57f8a1908c4fdb5daf126eaaac44dcaff2e1";

export const TEMP_LPS: Array<ILP> = [
  // {
  //   id: 1,
  //   token: {
  //     id: 6,
  //     name: "Aptos Coin",
  //     symbol: "APT",
  //     imgSrc: "https://cryptologos.cc/logos/aptos-apt-logo.svg?v=025",
  //     depositedAmount: 0
  //   },
  //   coin: {
  //     id: 3,
  //     name: "USD Coin",
  //     symbol: "USDC",
  //     imgSrc: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025",
  //     depositedAmount: 0
  //   },
  //   powererBrandSrc: "/assets/images/test-powerer-brand.png"
  // }
];

export const REGEX_NUMBER_VALID = /^[0-9]*\.?[0-9]*$/;

//  Pool Info
export const POOL_CONTRACT_ADDRESS =
  "0xAe816233f856058E4a6025E6B2Fc28F6b6E5999c";
export const POOL_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_rewardAddress","type":"address"},{"internalType":"address","name":"_ethAdddress","type":"address"},{"internalType":"address","name":"_usdtAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"borrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"calcTokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimPeko","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"claimProfit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimRewardToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"collateral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"debt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getEthValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLiquidationThreshhold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMarketInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMemberNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_poolAddress","type":"address"}],"name":"getPoolInfo","outputs":[{"components":[{"internalType":"uint256","name":"LTV","type":"uint256"},{"internalType":"uint256","name":"depositApy","type":"uint256"},{"internalType":"uint256","name":"borrowApy","type":"uint256"},{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"internalType":"struct Lending.PoolInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"getProfit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"getUserInfo","outputs":[{"components":[{"internalType":"uint256","name":"ethDepositAmount","type":"uint256"},{"internalType":"uint256","name":"usdtDepositAmount","type":"uint256"},{"internalType":"uint256","name":"ethBorrowAmount","type":"uint256"},{"internalType":"uint256","name":"usdtBorrowAmount","type":"uint256"},{"internalType":"uint256","name":"ethInterestAmount","type":"uint256"},{"internalType":"uint256","name":"usdtInterestAmount","type":"uint256"},{"internalType":"uint256","name":"ethRewardAmount","type":"uint256"},{"internalType":"uint256","name":"usdtRewardAmount","type":"uint256"},{"internalType":"uint256","name":"pekoRewardAmount","type":"uint256"},{"internalType":"uint256","name":"ethDepositTotalInUsdtAmount","type":"uint256"},{"internalType":"uint256","name":"usdtDepositTotalAmount","type":"uint256"},{"internalType":"uint256","name":"ethBorrowTotalInUsdtAmount","type":"uint256"},{"internalType":"uint256","name":"usdtBorrowTotalAmount","type":"uint256"},{"internalType":"address","name":"accountAddress","type":"address"}],"internalType":"struct Lending.UserInfoForDisplay","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"liquidate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"listPools","outputs":[{"components":[{"internalType":"uint256","name":"LTV","type":"uint256"},{"internalType":"uint256","name":"depositApy","type":"uint256"},{"internalType":"uint256","name":"borrowApy","type":"uint256"},{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"internalType":"struct Lending.PoolInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"page","type":"uint256"}],"name":"listUserInfo","outputs":[{"components":[{"internalType":"uint256","name":"ethDepositAmount","type":"uint256"},{"internalType":"uint256","name":"usdtDepositAmount","type":"uint256"},{"internalType":"uint256","name":"ethBorrowAmount","type":"uint256"},{"internalType":"uint256","name":"usdtBorrowAmount","type":"uint256"},{"internalType":"uint256","name":"ethInterestAmount","type":"uint256"},{"internalType":"uint256","name":"usdtInterestAmount","type":"uint256"},{"internalType":"uint256","name":"ethRewardAmount","type":"uint256"},{"internalType":"uint256","name":"usdtRewardAmount","type":"uint256"},{"internalType":"uint256","name":"pekoRewardAmount","type":"uint256"},{"internalType":"uint256","name":"ethDepositTotalInUsdtAmount","type":"uint256"},{"internalType":"uint256","name":"usdtDepositTotalAmount","type":"uint256"},{"internalType":"uint256","name":"ethBorrowTotalInUsdtAmount","type":"uint256"},{"internalType":"uint256","name":"usdtBorrowTotalAmount","type":"uint256"},{"internalType":"address","name":"accountAddress","type":"address"}],"internalType":"struct Lending.UserInfoForDisplay[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"repay","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_r0","type":"uint256"},{"internalType":"uint256","name":"_uOption","type":"uint256"},{"internalType":"uint256","name":"_rSlope1","type":"uint256"},{"internalType":"uint256","name":"_rSlope2","type":"uint256"}],"name":"setBorrowApy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"setLiquidationThreshhold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setPekoPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_r0","type":"uint256"},{"internalType":"uint256","name":"_uOption","type":"uint256"},{"internalType":"uint256","name":"_rSlope1","type":"uint256"},{"internalType":"uint256","name":"_rSlope2","type":"uint256"}],"name":"setSupplyApy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

//  USDC info
export const USDC_CONTRACT_ADDRESS =
  "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068";
export const USDC_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authorizer",
        type: "address"
      },
      { indexed: true, internalType: "bytes32", name: "nonce", type: "bytes32" }
    ],
    name: "AuthorizationCanceled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authorizer",
        type: "address"
      },
      { indexed: true, internalType: "bytes32", name: "nonce", type: "bytes32" }
    ],
    name: "AuthorizationUsed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address"
      }
    ],
    name: "Blacklisted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newBlacklister",
        type: "address"
      }
    ],
    name: "BlacklisterChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "burner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Burn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newMasterMinter",
        type: "address"
      }
    ],
    name: "MasterMinterChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Mint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minterAllowedAmount",
        type: "uint256"
      }
    ],
    name: "MinterConfigured",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldMinter",
        type: "address"
      }
    ],
    name: "MinterRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address"
      }
    ],
    name: "PauserChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRescuer",
        type: "address"
      }
    ],
    name: "RescuerChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address"
      }
    ],
    name: "UnBlacklisted",
    type: "event"
  },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
  {
    inputs: [],
    name: "CANCEL_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "authorizer", type: "address" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" }
    ],
    name: "authorizationState",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "blacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "blacklister",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "authorizer", type: "address" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" }
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "minter", type: "address" },
      { internalType: "uint256", name: "minterAllowedAmount", type: "uint256" }
    ],
    name: "configureMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "currency",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "decrement", type: "uint256" }
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "increment", type: "uint256" }
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "tokenName", type: "string" },
      { internalType: "string", name: "tokenSymbol", type: "string" },
      { internalType: "string", name: "tokenCurrency", type: "string" },
      { internalType: "uint8", name: "tokenDecimals", type: "uint8" },
      { internalType: "address", name: "newMasterMinter", type: "address" },
      { internalType: "address", name: "newPauser", type: "address" },
      { internalType: "address", name: "newBlacklister", type: "address" },
      { internalType: "address", name: "newOwner", type: "address" }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "string", name: "newName", type: "string" }],
    name: "initializeV2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "lostAndFound", type: "address" }
    ],
    name: "initializeV2_1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "isBlacklisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "masterMinter",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "minter", type: "address" }],
    name: "minterAllowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pauser",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "validAfter", type: "uint256" },
      { internalType: "uint256", name: "validBefore", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" }
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "minter", type: "address" }],
    name: "removeMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenContract",
        type: "address"
      },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "rescueERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "rescuer",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "validAfter", type: "uint256" },
      { internalType: "uint256", name: "validBefore", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" }
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "unBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_newBlacklister", type: "address" }
    ],
    name: "updateBlacklister",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_newMasterMinter", type: "address" }
    ],
    name: "updateMasterMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_newPauser", type: "address" }],
    name: "updatePauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newRescuer", type: "address" }],
    name: "updateRescuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  }
];
export const USDC_DECIMAL = 6;

//  Peko info
export const PEKO_CONTRACT_ADDRESS =
  "0x96E422C02149CBD21241F0E63da1f2E89371fDfc";
export const PEKO_DECIMAL = 18;

//  WETH info
export const WETH_CONTRACT_ADDRESS =
  "0x2C1b868d6596a18e32E61B901E4060C872647b6C";
export const WETH_DECIMAL = 18;

export const APY_DECIMAL = 2;

export const METADATA_OF_ASSET: IMetadataOfAsset = {
  eth: {
    id: 1,
    name: "Ethereum",
    symbol: "eth",
    imgSrc: "/assets/images/ethereum.png",
    contractAddress: WETH_CONTRACT_ADDRESS,
    decimals: WETH_DECIMAL
  },
  usdc: {
    id: 2,
    name: "USD Coin",
    symbol: "usdc",
    imgSrc: "/assets/images/usdc.png",
    contractAddress: USDC_CONTRACT_ADDRESS,
    decimals: USDC_DECIMAL
  }
};

export const IN_PROGRESS = "In Progress...";

export const ASSETS: Array<IAsset> = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "eth",
    imgSrc: "/assets/images/ethereum.png",
    contractAddress: WETH_CONTRACT_ADDRESS,
    decimals: WETH_DECIMAL
  },
  {
    id: 2,
    name: "USD Coin",
    symbol: "usdc",
    imgSrc: "/assets/images/usdc.png",
    contractAddress: USDC_CONTRACT_ADDRESS,
    decimals: USDC_DECIMAL
  }
];

export const DELAY_TIME = 6000; //  3s

export const ADMIN_WALLETS = [
  '0x32912fcf6b385653d7dbf235a66FFD917f47Eb68'
]