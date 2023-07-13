import { IChain, ILP, IToken } from "./interfaces";

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

export const POOL_CONTRACT_ADDRESS =
  "0x7099398c29a7ceb24c9fdb13c33256fd8dd00475";
//  The abi of the pool smart contract
export const POOL_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_rewardAddress", type: "address" },
      { internalType: "address", name: "_ethAdddress", type: "address" },
      { internalType: "address", name: "_usdtAddress", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  { stateMutability: "payable", type: "fallback" },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "borrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "calcCollater",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "calcDebt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" }
    ],
    name: "calcTokenPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "calcuateInterest",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "ethColAmount", type: "uint256" },
          { internalType: "uint256", name: "usdtColAmount", type: "uint256" },
          { internalType: "uint256", name: "pekoAmount", type: "uint256" }
        ],
        internalType: "struct Lending.Interest",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "claimETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "claimToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getUserInfo",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "ehtColAmount", type: "uint256" },
          { internalType: "uint256", name: "ehtDebtAmount", type: "uint256" },
          { internalType: "uint256", name: "usdtColAmount", type: "uint256" },
          { internalType: "uint256", name: "usdtDebtAmount", type: "uint256" }
        ],
        internalType: "struct Lending.UserInfoForDisplay",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "liquidate",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "listUserInfo",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "ehtColAmount", type: "uint256" },
          { internalType: "uint256", name: "ehtDebtAmount", type: "uint256" },
          { internalType: "uint256", name: "usdtColAmount", type: "uint256" },
          { internalType: "uint256", name: "usdtDebtAmount", type: "uint256" }
        ],
        internalType: "struct Lending.UserInfoForDisplay[]",
        name: "",
        type: "tuple[]"
      }
    ],
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "repay",
    outputs: [],
    stateMutability: "payable",
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
      { internalType: "address", name: "_tokenAddress", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
];

export const USDC_CONTRACT_ADDRESS =
  "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068";
export const USDC_CONTRACT_ABI = [
  {
    constant: false,
    inputs: [{ name: "newImplementation", type: "address" }],
    name: "upgradeTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "newImplementation", type: "address" },
      { name: "data", type: "bytes" }
    ],
    name: "upgradeToAndCall",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "implementation",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "newAdmin", type: "address" }],
    name: "changeAdmin",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "admin",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "_implementation", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "previousAdmin", type: "address" },
      { indexed: false, name: "newAdmin", type: "address" }
    ],
    name: "AdminChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "implementation", type: "address" }],
    name: "Upgraded",
    type: "event"
  }
];
export const USDC_DECIMAL = 6;

export const WETH_CONTRACT_ADDRESS = '0x2C1b868d6596a18e32E61B901E4060C872647b6C';
export const WETH_DECIMAL = 18;

export const METADATA_OF_ASSET = {
  eth: {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    imgSrc: "/assets/images/ethereum.png"
  },
  usdc: {
    id: 2,
    name: "USD Coin",
    symbol: "USDC",
    imgSrc: "/assets/images/usdc.png"
  }
};
