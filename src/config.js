import {keyStores} from 'near-api-js';
import {env} from "./env.js"
const key = new keyStores.BrowserLocalStorageKeyStore();

export function getConfig() {
    switch (env) {
      case 'production':
      case 'mainnet':
        return {
          networkId: 'mainnet',
          keyStore: key,
          nodeUrl: 'https://rpc.mainnet.near.org',
          walletUrl: 'https://wallet.near.org',
          helperUrl: 'https://helper.mainnet.near.org',
          RULE_CONTRACT: 'app.nepbot.near',
          OCT_CONTRACT: 'registry.test_oct.testnet',
        }
      case 'development':
      case 'testnet':
        return {
          networkId: 'testnet',
          keyStore: key,
          nodeUrl: 'https://rpc.testnet.near.org',
          walletUrl: 'https://wallet.testnet.near.org',
          helperUrl: 'https://helper.testnet.near.org',
          RULE_CONTRACT: 'v2-discord-roles.bhc8521.testnet',
          OCT_CONTRACT: 'registry.test_oct.testnet',
          LINKDROP: 'linkdrop6.bhc8521.testnet',
        }
      case 'betanet':
        return {
          networkId: 'betanet',
          keyStore: key,
          nodeUrl: 'https://rpc.betanet.near.org',
          walletUrl: 'https://wallet.betanet.near.org',
          helperUrl: 'https://helper.betanet.near.org'
        }
      case 'local':
        return {
          networkId: 'local',
          keyStore: key,
          nodeUrl: 'http://localhost:3030',
          keyPath: `${process.env.HOME}/.near/validator_key.json`,
          walletUrl: 'http://localhost:4000/wallet',
        }
      case 'test':
      case 'ci':
        return {
          networkId: 'shared-test',
          keyStore: key,
          nodeUrl: 'https://rpc.ci-testnet.near.org',
          masterAccount: 'test.near'
        }
      case 'ci-betanet':
        return {
          networkId: 'shared-test-staging',
          keyStore: key,
          nodeUrl: 'https://rpc.ci-betanet.near.org',
          masterAccount: 'test.near'
        }
      default:
        throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
    }
}