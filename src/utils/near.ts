/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 03:53:57
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-17 03:28:39
 * @ Description: i@rua.moe
 */

import { base58 } from 'ethers/lib/utils';
import { KeyPair } from 'near-api-js';

export function TrimLeadingZeroes(value: string) {
  value = value.replace(/^0+/, '');
  if (value === '') {
    return '0';
  }
  return value;
}

export function ParseAmount(amt: string, decimals: number = 24) {
  if (!amt) {
    return null;
  }
  amt = amt.replace(/,/g, '').trim();
  const split = amt.split('.');
  const wholePart = split[0];
  const fracPart = split[1] || '';
  if (split.length > 2 || fracPart.length > decimals) {
    throw new Error(`Cannot parse '${amt}'`);
  }
  return TrimLeadingZeroes(wholePart + fracPart.padEnd(decimals, '0'));
}

export function SignMessage({
  keystore,
  message,
}: {
  keystore: string;
  message: string;
}) {
  const keyPair = KeyPair.fromString(keystore);
  const signed = keyPair.sign(Buffer.from(message));

  return {
    signature: base58.encode(signed.signature),
    publicKey: signed.publicKey.toString(),
  };
}
