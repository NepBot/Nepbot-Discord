/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 02:50:33
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-08 03:31:39
 * @ Description: i@rua.moe
 */

import { arbitrum, goerli, mainnet, polygon } from 'wagmi/chains';

export const expDate = 1669910399;

const isDev: boolean = true;

export const SITE_CONFIG = {
  title: 'NEPBOT',
  abbr: 'NEPBOT',
};

export const WALLETCONNECT = {
  projectID: 'e955aa92a6d9db97160d53e9afc53f5d',
  appName: 'Nepbot',
  chains: [arbitrum, mainnet, polygon, goerli],
  chainsID: [arbitrum.id, mainnet.id, polygon.id, goerli.id],
  universalChains: ['eip155:80001'],
  methods: [
    'eth_sendTransaction',
    'eth_signTransaction',
    'eth_sign',
    'personal_sign',
    'eth_signTypedData',
  ],
  events: [
    'chainChanged',
    'accountsChanged',
    'connect',
    'session_event',
    'display_uri',
    'disconnect',
  ],
  metadata: {
    name: 'Nepbot',
    description: 'Nepbot for WalletConnect',
    url: 'https://Nepbot.io/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
  logger: 'info',
};
