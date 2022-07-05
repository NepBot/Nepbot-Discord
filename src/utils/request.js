import {connect, WalletConnection} from "near-api-js";
import {Base64} from 'js-base64';
import {getConfig} from "../config";
const config = getConfig();

export async function generateToken() {
    const _near = await connect(config);
    const _wallet = new WalletConnection(_near,"nepbot");
    const account = await _wallet.account();
    const accountId = account.accountId;

    const arr = new Array(accountId)
    for (var i = 0; i < accountId.length; i++) {
        arr[i] = accountId.charCodeAt(i)
    }

    const msgBuf = new Uint8Array(arr)
    const signedMsg = await account.connection.signer.signMessage(msgBuf, accountId, config.networkId)

    const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
    const signature = Buffer.from(signedMsg.signature).toString('hex')
    const payload = [accountId, pubKey, signature]

    return Base64.encode(payload.join('&'))
}