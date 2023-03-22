import { useCallback, useEffect } from 'react';
/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-23 01:25:54
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-23 03:29:12
 * @ Description: i@rua.moe
 */

import { API_CONFIG } from '@/constants/config';
import { Chain, Network, Wallet } from 'mintbase';
import { useState } from 'react';
import { _MINTBASE_API_KEY } from './../constants/env';

export default () => {
  const [mintbaseWallet, setMintbaseWallet] = useState<Wallet>();

  const initMintbaseWallet = useCallback(async () => {
    const { data: walletData, error } = await new Wallet().init({
      networkName: API_CONFIG().networkId as Network,
      chain: Chain.near,
      apiKey: _MINTBASE_API_KEY,
    });

    const { wallet, isConnected } = walletData;

    if (isConnected) {
      const { data: details } = await wallet.details();
      console.log('Mintbase wallet details: ', details);
      /*
      accountId: "qwerty.testnet"
      allowance: "0.25"
      balance: "365.77"
      contractName: "mintbase13.testnet"
    */
    }
    setMintbaseWallet(wallet);
  }, []);

  useEffect(() => {
    initMintbaseWallet();
  }, []);

  return {
    mintbaseWallet,
    initMintbaseWallet,
  };
};
