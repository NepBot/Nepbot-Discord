import {connect, KeyPair, keyStores, utils, WalletConnection} from "near-api-js";
import {config} from "../config";
import bs58 from 'bs58'
const account_id = 'lzs.testnet';
export const contract = async ()=>{
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY =
        "5tzMa75ppoMcLb8i7yyX2EfZsvnnyfSmss9ReiKVSZu4oXat5tQ1M5U6VVFaehqWnmT9gdK7Y5ygerEvXB8qbR2t";
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey("testnet", account_id, keyPair);
    console.log(keyStore);

    config.keyStore = keyStore;
    const _near = await connect(config);
    return await _near.account(account_id);
}

export function parseAmount(amount) {
    return utils.format.parseNearAmount(String(amount))
}

export function formatAmount(amount) {
    return utils.format.formatNearAmount(String(amount))
}

export async function sign(account, obj) {
    console.log(account)
    const keyPair = await account.connection.signer.keyStore.getKey(config.networkId, account.accountId);
    const data_buffer = Buffer.from(JSON.stringify(obj));
    const { signature } = keyPair.sign(data_buffer);
    let sign = bs58.encode(signature);
    return sign
}