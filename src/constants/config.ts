/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 02:50:33
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-13 04:03:04
 * @ Description: i@rua.moe
 */

import { keyStores } from 'near-api-js';
import { _MINTBASE_API_KEY, _NETWORK, _WALLETCONNECT_PROJECT_ID } from './env';

const key = new keyStores.BrowserLocalStorageKeyStore();

export const SITE_CONFIG = {
  title: 'NEPBOT',
  abbr: 'NEPBOT',
};

export const MINTBASE_API_KEY = _MINTBASE_API_KEY;

export const NETWORK_URL = {
  mainnet: 'https://nepbot.org/',
  testnet: 'https://testnet.nepbot.org/',
};

export const BOT_URL = {
  mainnet:
    'https://discord.com/oauth2/authorize?client_id=958997413803196476&permissions=8&scope=bot applications.commands',
  testnet:
    'https://discord.com/oauth2/authorize?client_id=928559137179172874&permissions=8&scope=bot applications.commands',
};

export const WALLETCONNECT_CONFIG = () => {
  switch (_NETWORK) {
    case 'production':
    case 'mainnet':
      return {
        projectID: _WALLETCONNECT_PROJECT_ID,
        appName: 'NEPBOT',
        chainsId: 'near:mainnet',
        metadata: {
          name: 'Nepbot',
          description: 'Nepbot for WalletConnect',
          url: 'https://Nepbot.io/',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        iconUrl: 'https://avatars.githubusercontent.com/u/37784886',
        logger: 'info',
      };
    case 'development':
    case 'testnet':
      return {
        projectID: _WALLETCONNECT_PROJECT_ID,
        appName: 'NEPBOT',
        chainsId: 'near:testnet',
        metadata: {
          name: 'Nepbot',
          description: 'Nepbot for WalletConnect',
          url: 'https://Nepbot.io/',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        iconUrl: 'https://avatars.githubusercontent.com/u/37784886',
        logger: 'info',
      };
    case 'dev-testnet':
      return {
        projectID: _WALLETCONNECT_PROJECT_ID,
        appName: 'NEPBOT',
        chainsId: 'near:testnet',
        metadata: {
          name: 'Nepbot',
          description: 'Nepbot for WalletConnect',
          url: 'https://Nepbot.io/',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        iconUrl: 'https://avatars.githubusercontent.com/u/37784886',
        logger: 'info',
      };
    case 'betanet':
      return {
        projectID: _WALLETCONNECT_PROJECT_ID,
        appName: 'NEPBOT',
        chainsId: 'near:betanet',
        metadata: {
          name: 'Nepbot',
          description: 'Nepbot for WalletConnect',
          url: 'https://Nepbot.io/',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        iconUrl: 'https://avatars.githubusercontent.com/u/37784886',
        logger: 'info',
      };
    case 'local':
      return {
        projectID: _WALLETCONNECT_PROJECT_ID,
        appName: 'NEPBOT',
        chainsId: 'near:local',
        metadata: {
          name: 'Nepbot',
          description: 'Nepbot for WalletConnect',
          url: 'https://Nepbot.io/',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        iconUrl: 'https://avatars.githubusercontent.com/u/37784886',
        logger: 'info',
      };
    case 'test':
    case 'ci':
      return {
        projectID: _WALLETCONNECT_PROJECT_ID,
        appName: 'NEPBOT',
        chainsId: 'near:shared-test',
        metadata: {
          name: 'Nepbot',
          description: 'Nepbot for WalletConnect',
          url: 'https://Nepbot.io/',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        iconUrl: 'https://avatars.githubusercontent.com/u/37784886',
        logger: 'info',
      };
    case 'ci-betanet':
      return {
        projectID: _WALLETCONNECT_PROJECT_ID,
        appName: 'NEPBOT',
        chainsId: 'near:shared-test-staging',
        metadata: {
          name: 'Nepbot',
          description: 'Nepbot for WalletConnect',
          url: 'https://Nepbot.io/',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        iconUrl: 'https://avatars.githubusercontent.com/u/37784886',
        logger: 'info',
      };
    default:
      throw Error(`Unconfigured environment '${_NETWORK}'.`);
  }
};

export const API_CONFIG = () => {
  switch (_NETWORK) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        keyStore: key,
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://nearblocks.io',
        RULE_CONTRACT: 'app.nepbot.near',
        NFT_CONTRACT: 'nft.nepbot.near',
        SNAPSHOT_CONTRACT: 'snapshot.nepbot.near',
        AIRDROP_CONTRACT: 'airdrop.nepbot.near',
        OCT_CONTRACT: 'octopus-registry.near',
        PARAS_CONTRACT: 'x.paras.near',
        H00KD_CONTRACT: 'h00kd.near',
        MINTBASE_CONTRACT: 'nepbot.mintbase1.near',
        APPLICATION_ID: '958997413803196476',
        PARAS_API: 'https://api-v2-mainnet.paras.id',
        AEWEAVE_API: 'https://arweave.net',
        PARAS: 'https://paras.id',
        ASTRO: 'https://app.astrodao.com/',
        IPFS: 'https://ipfs.fleek.co/ipfs/',
        NEARBLOCKS: 'https://nearblocks.io/address/',
      };
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        keyStore: key,
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://testnet.nearblocks.io',
        RULE_CONTRACT: 'app.nepbot.testnet',
        NFT_CONTRACT: 'nft.nepbot.testnet',
        SNAPSHOT_CONTRACT: 'snapshot.nepbot.testnet',
        AIRDROP_CONTRACT: 'airdrop.nepbot.testnet',
        OCT_CONTRACT: 'registry.test_oct.testnet',
        PARAS_CONTRACT: 'paras-token-v2.testnet',
        H00KD_CONTRACT: 'h00kd.near',
        MINTBASE_CONTRACT: 'nepbot.mintspace2.testnet',
        APPLICATION_ID: '928559137179172874',
        PARAS_API: 'https://api-v3-marketplace-testnet.paras.id',
        AEWEAVE_API: 'https://arweave.net',
        PARAS: 'https://testnet.paras.id',
        ASTRO: 'https://testnet.app.astrodao.com/',
        IPFS: 'https://ipfs.fleek.co/ipfs/',
        NEARBLOCKS: 'https://testnet.nearblocks.io/address/',
      };
    case 'dev-testnet':
      return {
        networkId: 'testnet',
        keyStore: key,
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://testnet.nearblocks.io',
        RULE_CONTRACT: 'app.dev-nepbot.testnet',
        NFT_CONTRACT: 'nft.dev-nepbot.testnet',
        SNAPSHOT_CONTRACT: 'snapshot.dev-nepbot.testnet',
        AIRDROP_CONTRACT: 'airdrop.dev-nepbot.testnet',
        OCT_CONTRACT: 'registry.test_oct.testnet',
        PARAS_CONTRACT: 'paras-token-v2.testnet',
        H00KD_CONTRACT: 'h00kd.near',
        MINTBASE_CONTRACT: 'devnepbot.mintspace2.testnet',
        APPLICATION_ID: '967009211823304744',
        PARAS_API: 'https://api-v3-marketplace-testnet.paras.id',
        AEWEAVE_API: 'https://arweave.net',
        PARAS: 'https://testnet.paras.id',
        ASTRO: 'https://testnet.app.astrodao.com/',
        IPFS: 'https://ipfs.fleek.co/ipfs/',
        NEARBLOCKS: 'https://testnet.nearblocks.io/address/',
      };
    case 'betanet':
      return {
        networkId: 'betanet',
        keyStore: key,
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
      };
    case 'local':
      return {
        networkId: 'local',
        keyStore: key,
        nodeUrl: 'http://localhost:3030',
        //keyPath: `.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
      };
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        keyStore: key,
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        masterAccount: 'test.near',
      };
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        keyStore: key,
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        masterAccount: 'test.near',
      };
    default:
      throw Error(`Unconfigured environment '${_NETWORK}'.`);
  }
};
