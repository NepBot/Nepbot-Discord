/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 02:50:33
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-15 02:43:54
 * @ Description: i@rua.moe
 */

import { keyStores } from 'near-api-js';
import { ENV_NETWORK } from './env';

const key = new keyStores.BrowserLocalStorageKeyStore();

export const SITE_CONFIG = {
  title: 'NEPBOT',
  abbr: 'NEPBOT',
};

export const API_CONFIG = () => {
  switch (ENV_NETWORK) {
    case 'production':
    case 'mainnet':
      return {
        WALLETCONNECT: {
          projectID: '3d19dc4846f16221f55bc36f2e3d0197',
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
        },
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
        APPLICATION_ID: '958997413803196476',
        PARAS_API: 'https://api-v2-mainnet.paras.id',
        PARAS: 'https://paras.id',
        ASTRO: 'https://app.astrodao.com/',
      };
    case 'development':
    case 'testnet':
      return {
        WALLETCONNECT: {
          projectID: '3d19dc4846f16221f55bc36f2e3d0197',
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
        },
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
        APPLICATION_ID: '928559137179172874',
        PARAS_API: 'https://api-v3-marketplace-testnet.paras.id',
        PARAS: 'https://testnet.paras.id',
        ASTRO: 'https://testnet.app.astrodao.com/',
      };
    case 'dev-testnet':
      return {
        WALLETCONNECT: {
          projectID: '3d19dc4846f16221f55bc36f2e3d0197',
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
        },
        networkId: 'testnet',
        keyStore: key,
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://testnet.nearblocks.io',
        RULE_CONTRACT: 'app.dev-nepbot.testnet',
        NFT_CONTRACT: 'nft.dev-nepbot.testnet',
        SNAPSHOT_CONTRACT: 'dev-1661250591703-95464982614704',
        AIRDROP_CONTRACT: 'airdrop.dev-nepbot.testnet',
        OCT_CONTRACT: 'registry.test_oct.testnet',
        PARAS_CONTRACT: 'paras-token-v2.testnet',
        APPLICATION_ID: '967009211823304744',
        PARAS_API: 'https://api-v3-marketplace-testnet.paras.id',
        PARAS: 'https://testnet.paras.id',
        ASTRO: 'https://testnet.app.astrodao.com/',
      };
    case 'betanet':
      return {
        WALLETCONNECT: {
          projectID: '3d19dc4846f16221f55bc36f2e3d0197',
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
        },
        networkId: 'betanet',
        keyStore: key,
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
      };
    case 'local':
      return {
        WALLETCONNECT: {
          projectID: '3d19dc4846f16221f55bc36f2e3d0197',
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
        },
        networkId: 'local',
        keyStore: key,
        nodeUrl: 'http://localhost:3030',
        //keyPath: `.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
      };
    case 'test':
    case 'ci':
      return {
        WALLETCONNECT: {
          projectID: '3d19dc4846f16221f55bc36f2e3d0197',
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
        },
        networkId: 'shared-test',
        keyStore: key,
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        masterAccount: 'test.near',
      };
    case 'ci-betanet':
      return {
        WALLETCONNECT: {
          projectID: '3d19dc4846f16221f55bc36f2e3d0197',
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
        },
        networkId: 'shared-test-staging',
        keyStore: key,
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        masterAccount: 'test.near',
      };
    default:
      throw Error(`Unconfigured environment '${process.env.ENV_NETWORK}'.`);
  }
};
