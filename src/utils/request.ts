/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-20 16:39:02
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-01 02:53:49
 * @ Description: 
 */

import { API_CONFIG } from '@/constants/config';
import { Account } from 'near-api-js';

export async function GenerateToken({ nearAccount }: { nearAccount: Account }) {
  const arr = new Uint8Array(nearAccount?.accountId?.length);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = nearAccount?.accountId?.charCodeAt(i);
  }

  const signedMessage = await nearAccount?.connection?.signer?.signMessage(
    arr,
    nearAccount.accountId,
    API_CONFIG().networkId,
  );

  const publicKey = Buffer.from(signedMessage?.publicKey?.data).toString('hex');
  const signature = Buffer.from(signedMessage?.signature).toString('hex');
  const payload = [nearAccount?.accountId, publicKey, signature];

  return Buffer.from(payload?.join('&')).toString('base64');
}

export function IsObjectValueEqual(a: any, b: any) {
  if (a === b) return true;
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) return false;
  for (let prop in a) {
    if (b.hasOwnProperty(prop)) {
      if (typeof a[prop] === 'object') {
        if (!IsObjectValueEqual(a[prop], b[prop])) return false;
      } else if (a[prop] !== b[prop]) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}
