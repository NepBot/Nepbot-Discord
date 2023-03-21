import { _MINTBASE_API_KEY } from './../constants/env';
/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-20 15:50:57
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-20 16:05:00
 * @ Description: i@rua.moe
 */

import { API_CONFIG } from '@/constants/config';
import { Chain, Network, Wallet } from 'mintbase';

export default async function GetMintbaseMinter() {
  const { data: walletData, error } = await new Wallet().init({
    networkName: API_CONFIG().networkId as Network,
    chain: Chain.near,
    apiKey: _MINTBASE_API_KEY,
  });

  const { wallet, isConnected } = walletData;

  if (isConnected) {
    const { data: details } = await wallet.details();
    console.log(details);
    /*
      accountId: "qwerty.testnet"
      allowance: "0.25"
      balance: "365.77"
      contractName: "mintbase13.testnet"
    */
  }

  return wallet.minter;
}
