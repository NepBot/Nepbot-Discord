import {keyStores} from 'near-api-js';
const key = new keyStores.BrowserLocalStorageKeyStore();
export const config = {
  RULE_CONTRACT: 'v2-discord-roles.bhc8521.testnet',
  OCT_CONTRACT: 'registry.test_oct.testnet',
  networkId: "testnet",
  keyStore: key,
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};
