import { API_CONFIG } from '@/constants/config';
/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 03:53:57
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-15 15:55:55
 * @ Description: i@rua.moe
 */

export const GetPrivateKey = async (accountId: string) => {
  var privateKey;
  const walletId = localStorage
    .getItem('near-wallet-selector:selectedWalletId')
    ?.replaceAll('"', '');

  switch (walletId) {
    case 'meteor-wallet':
      privateKey = localStorage.getItem(
        `_meteor_wallet${accountId}:${API_CONFIG().networkId}`,
      );
      break;
    default:
      privateKey = localStorage.getItem(
        `nepbot:keystore:${accountId}:${API_CONFIG().networkId}`,
      );
  }

  return privateKey;
};
