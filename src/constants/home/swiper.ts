/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-15 03:22:13
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-31 15:56:04
 * @ Description: i@rua.moe
 */

import { BOT_URL } from '../config';
import { _NETWORK } from '../env';

export const SWIPER = [
  {
    title: 'Permissionless, free, and open-source',
    desc: 'A public good for NEAR communities',
    button: 'Start with one click',
    image: 'pic-1.webp',
    link: _NETWORK === 'mainnet' ? BOT_URL.mainnet : BOT_URL.testnet,
  },
  {
    title: 'Easily create gating rules for roles',
    desc: 'Nepbot provides safe token-gating solutions to create customizable and composable access rules for roles in your Discord communities',
    button: 'Read more',
    image: 'pic-2.webp',
    link: 'https://nepbot.github.io/Nepbot-gitbook/doc/Set_Rules_for_Roles.html',
  },
  {
    title: 'Engage the community with a more powerful set of tools',
    desc: 'Reward your members by launching token airdrops or exclusive NFTs with Nepbot built-in functions',
    button: 'Read more',
    image: 'pic-3.webp',
    link: 'https://nepbot.github.io/Nepbot-gitbook/doc/NEP141_Airdrop.html',
  },
  {
    title: 'Verify with NEAR wallets to unlock exclusive access',
    desc: 'Connect wallet, verify your ownership, and unlock possibilities',
    button: 'How to verify',
    image: 'pic-4.webp',
    link: '',
  },
];
