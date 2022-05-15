import {connect, KeyPair, keyStores, utils, WalletConnection} from "near-api-js";
import {getConfig} from "../config";
import bs58 from 'bs58'
import { encode } from 'blurhash'

const config = getConfig();

export const contract = async ()=>{
    const near = await connect(config);
    return await near.account();
}

function trimLeadingZeroes(value) {
    value = value.replace(/^0+/, '');
    if (value === '') {
        return '0';
    }
    return value;
}

function trimTrailingZeroes(value) {
    return value.replace(/\.?0*$/, '');
}

function formatWithCommas(value) {
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(value)) {
        value = value.replace(pattern, '$1,$2');
    }
    return value;
}

export function parseAmount(amt, decimals=24) {
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
    return trimLeadingZeroes(wholePart + fracPart.padEnd(decimals, '0'));
    
}

export function formatAmount(balance, decimals=24, fracDigits=2) {
    const wholeStr = balance.substring(0, balance.length - decimals) || '0';
    const fractionStr = balance.substring(balance.length - decimals)
        .padStart(decimals, '0').substring(0, fracDigits);
    return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${fractionStr}`);
}

export async function sign(account, obj) {
    const keyPair = await account.connection.signer.keyStore.getKey(config.networkId, account.accountId);
    const data_buffer = Buffer.from(JSON.stringify(obj));
    const { signature } = keyPair.sign(data_buffer);
    let sign = bs58.encode(signature);
    return sign
}



async function loadImage(src) {
	new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = (...args) => reject(args)
		img.src = src
	})
}

function getImageData(image) {
	const canvas = document.createElement('canvas')
	canvas.width = 360
	canvas.height = 400
	const context = canvas.getContext('2d')
	context.drawImage(image, 0, 0)
	return context.getImageData(0, 0, 360, 400)
}

export async function encodeImageToBlurhash(imageUrl) {
	const image = await loadImage(imageUrl)
	const imageData = getImageData(image)
	return encode(imageData.data, imageData.width, imageData.height, 4, 4)
}