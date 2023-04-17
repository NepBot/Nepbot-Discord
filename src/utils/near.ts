/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 03:53:57
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-07 04:54:30
 * @ Description: 
 */

import { API_CONFIG } from '@/constants/config';
import { encode } from 'blurhash';
import BN from 'bn.js';
import bs58 from 'bs58';
import { Account, KeyPair, connect } from 'near-api-js';

export async function Contract({ nearAccount }: { nearAccount?: Account }) {
  if (!!nearAccount?.accountId) {
    const near = await connect(API_CONFIG());
    return await near.account(nearAccount?.accountId);
  }
}

export function TrimLeadingZeroes({ value }: { value: string }) {
  value = value.replace(/^0+/, '');
  if (value === '') {
    return '0';
  }
  return value;
}

export function TrimTrailingZeroes({ value }: { value: string }) {
  return value.replace(/\.?0*$/, '');
}

export function FormatWithCommas({ value }: { value: string }) {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, '$1,$2');
  }
  return value;
}

export function ParseAmount({
  amount,
  decimals = 24,
}: {
  amount: string;
  decimals?: number;
}) {
  if (!amount) {
    return null;
  }
  amount = amount.replace(/,/g, '').trim();
  const split = amount.split('.');
  const wholePart = split[0];
  const fracPart = split[1] || '';
  if (split.length > 2 || fracPart.length > decimals) {
    throw new Error(`Cannot parse '${amount}'`);
  }
  return TrimLeadingZeroes({
    value: wholePart + fracPart.padEnd(decimals, '0'),
  });
}

export function FormatAmount({
  amount,
  decimals = 24,
  fracDigits = 2,
}: {
  amount?: string;
  decimals?: number;
  fracDigits?: number;
}) {
  const wholeStr = amount?.substring(0, amount?.length - decimals) || '0';
  const fractionStr = amount
    ?.substring(amount?.length - decimals)
    ?.padStart(decimals, '0')
    ?.substring(0, fracDigits);
  return TrimTrailingZeroes({
    value: `${FormatWithCommas({
      value: wholeStr,
    })}.${fractionStr}`,
  });
}

export function SignMessage({
  keystore,
  object,
}: {
  keystore: string;
  object: Object;
}) {
  const keyPair = KeyPair.fromString(keystore);
  const signed = keyPair.sign(Buffer.from(JSON.stringify(object)));

  return {
    signature: bs58.encode(signed.signature),
    publicKey: signed.publicKey.toString(),
  };
}

export function LoadImage({ src }: { src: string }) {
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function GetImageData({ image }: { image: HTMLImageElement }) {
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 400;
  const context = canvas.getContext('2d');
  context?.drawImage(image, 0, 0);
  return context?.getImageData(0, 0, 360, 400);
}

export async function EncodeImageToBlurHash({
  imageData,
}: {
  imageData: ImageData;
}) {
  return await encode(imageData.data, imageData.width, imageData.height, 4, 4);
}

export function GetGas({ gas }: { gas: string }) {
  return gas ? new BN(gas) : new BN('300000000000000');
}

export function GetDeposit({ amount }: { amount: string }) {
  return amount ? new BN(amount) : new BN('0');
}

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};
