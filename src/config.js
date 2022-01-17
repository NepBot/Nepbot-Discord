import {keyStores} from 'near-api-js';
const key = new keyStores.BrowserLocalStorageKeyStore();
console.log(key)
export const config = {
  networkId: "testnet",
  keyStore: key,
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};
