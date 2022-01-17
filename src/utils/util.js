import {connect, KeyPair, keyStores} from "near-api-js";
import {config} from "../config";
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
