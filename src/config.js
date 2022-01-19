import {keyStores} from 'near-api-js';
const key = new keyStores.BrowserLocalStorageKeyStore();
export const config = {
  contract_id: 'discord-roles.bhc8521.testnet',
  networkId: "testnet",
  keyStore: key,
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};
