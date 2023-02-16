/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 16:38:02
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-16 23:41:30
 * @ Description: i@rua.moe
 */

import { useCallback, useState } from 'react';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { ethers } from "ethers";
import { configureChains, createClient } from 'wagmi';
import { Core } from "@walletconnect/core";
import Provider, { EthereumProvider } from "@walletconnect/ethereum-provider";
import UniversalProvider from "@walletconnect/universal-provider";
import SignClient from '@walletconnect/sign-client';
import AuthClient from '@walletconnect/auth-client';
import { DappClient as PushDappClient } from "@walletconnect/push-client";
import { WALLETCONNECT } from '@/constants/config';
import { ICore } from '@walletconnect/types';

export default () => {
  const [ethereumProvider, setEthereumProvider] = useState<Provider>();
  const [core, setCore] = useState<ICore>();
  const [signClient, setSignClient] = useState<SignClient>();
  const [authClient, setAuthClient] = useState<AuthClient>();
  const [pushClient, setPushClient] = useState<PushDappClient>();
  const [universalProvider, setUniversalProvider] = useState<UniversalProvider>();
  const [web3Provider, setWeb3Provider] = useState<ethers.providers.Web3Provider>();

  // Wagmi client
  const { provider } = configureChains(WALLETCONNECT.chains, [
    walletConnectProvider({ projectId: WALLETCONNECT.projectID }),
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: WALLETCONNECT.projectID,
      version: "2",
      appName: WALLETCONNECT.appName,
      chains: WALLETCONNECT.chains,
    }),
    provider,
  });

  // Web3Modal Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, WALLETCONNECT.chains);

  const InitializeWalletConnect = useCallback(async () => {
    // WalletConnect Ethereum Provider
    const ethereumProvider = await EthereumProvider.init({
      projectId: WALLETCONNECT.projectID,
      chains: WALLETCONNECT.chainsID,
      methods: WALLETCONNECT.methods,
      events: WALLETCONNECT.events,
      metadata: WALLETCONNECT.metadata,
      showQrModal: true,
    });
    setEthereumProvider(ethereumProvider);

    const core = new Core({
      projectId: WALLETCONNECT.projectID,
    });
    setCore(core);

    const signClient = await SignClient.init({
      core,
      projectId: WALLETCONNECT.projectID,
      metadata: WALLETCONNECT.metadata,
    });
    setSignClient(signClient);

    const authClient = await AuthClient.init({
      core,
      projectId: WALLETCONNECT.projectID,
      metadata: WALLETCONNECT.metadata,
    });
    setAuthClient(authClient);

    const pushClient = await PushDappClient.init({
      core,
      projectId: WALLETCONNECT.projectID,
      metadata: WALLETCONNECT.metadata,
    });
    setPushClient(pushClient);

    // Universal Provider
    const universalProvider = await UniversalProvider.init({
      logger: WALLETCONNECT.logger,
      projectId: WALLETCONNECT.projectID,
      metadata: WALLETCONNECT.metadata,
      client: signClient,
    });
    setUniversalProvider(universalProvider);

    //  Create Web3 Provider
    const web3Provider = new ethers.providers.Web3Provider(universalProvider);
    setWeb3Provider(web3Provider);
  }, []);

  const UniversalConnect = useCallback(async () => {
    if (!universalProvider) return;
    //  create sub providers for each namespace/chain
    await universalProvider.connect({
      namespaces: {
        eip155: {
          methods: WALLETCONNECT.methods,
          chains: WALLETCONNECT.universalChains,
          events: WALLETCONNECT.events,
        },
      },
    });
  }, []);

  return {
    InitializeWalletConnect,
    wagmiClient,
    ethereumClient,
    ethereumProvider,
    UniversalConnect,
    web3Provider,
    universalProvider,
    core,
    signClient,
    authClient,
    pushClient,
  };
}
