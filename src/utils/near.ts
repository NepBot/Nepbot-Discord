/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 03:53:57
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-21 21:42:34
 * @ Description: i@rua.moe
 */

import { API_CONFIG } from '@/constants/config';
import { encode } from 'blurhash';
import BN from 'bn.js';
import { base58 } from 'ethers/lib/utils';
import { Account, KeyPair, connect } from 'near-api-js';

export async function Contract({ nearAccount }: { nearAccount?: Account }) {
  if (!!nearAccount?.accountId) {
    const near = await connect(API_CONFIG());
    return await near.account(nearAccount?.accountId);
  }
}

export async function TrimLeadingZeroes({ value }: { value: string }) {
  value = value.replace(/^0+/, '');
  if (value === '') {
    return '0';
  }
  return value;
}

export async function TrimTrailingZeroes({ value }: { value: string }) {
  return value?.replace(/\.?0*$/, '');
}

export async function FormatWithCommas({ value }: { value: string }) {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, '$1,$2');
  }
  return value;
}

export async function ParseAmount({
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

export async function FormatAmount({
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
    value: FormatWithCommas({ value: wholeStr }) + '.' + fractionStr,
  });
}

export async function SignMessage({
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

export async function LoadImage({ src }: { src: string }) {
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function GetImageData({ image }: { image: HTMLImageElement }) {
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

export async function GetGas({ gas }: { gas: string }) {
  return gas ? new BN(gas) : new BN('300000000000000');
}

export async function GetDeposit({ amount }: { amount: string }) {
  return amount ? new BN(amount) : new BN('0');
}
