import { Wallet, Chain, Network } from 'mintbase'
import {getConfig} from "../config";
const config = getConfig();

// Connect and fetch details
export default async function getMinter() {
  const { data: walletData, error } = await new Wallet().init({
    networkName: config.networkId,
    chain: Chain.near,
    apiKey: "a3bd8cb1-a044-442e-98e2-375512c31fb0",
  })

  const { wallet, isConnected } = walletData


//   if (isConnected) {
//     const { data: details } = await wallet.details()
//     console.log(details)
//     /*
//       accountId: "qwerty.testnet"
//       allowance: "0.25"
//       balance: "365.77"
//       contractName: "mintbase13.testnet"
//     */
//   }
  return wallet.minter
}