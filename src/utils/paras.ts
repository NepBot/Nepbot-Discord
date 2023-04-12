/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-12 18:17:38
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-14 03:58:37
 * @ Description: i@rua.moe
 */

import { API_CONFIG } from '@/constants/config';
import { connect, WalletConnection } from 'near-api-js';

export async function GenerateToken() {
  const near = await connect(API_CONFIG());
  const wallet = new WalletConnection(near, "near_app");
  const account = await wallet.account();
  const accountId = account.accountId;

  const arr = new Array(accountId.length);
  for (var i = 0; i < accountId.length; i++) {
    arr[i] = accountId.charCodeAt(i);
  }

  const msgBuf = new Uint8Array(arr);
  const signedMsg = await account.connection.signer.signMessage(
    msgBuf,
    accountId,
    API_CONFIG().networkId,
  );

  const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex');
  const signature = Buffer.from(signedMsg.signature).toString('hex');
  const payload = [accountId, pubKey, signature];

  return Buffer.from(payload.join('&')).toString('base64');
}
