import * as transaction from "near-api-js/lib/transaction.js";
import * as nearAPI from 'near-api-js';
import {getConfig} from '../config';
import { PublicKey } from 'near-api-js/lib/utils';
import { baseDecode } from 'borsh';
import { getGas, getDeposit } from './util';
import WalletSelector from './walletSelector';

const config = getConfig()

export async function requestTransaction(account, contractId, methodName, args, gas='300000000000000', deposit='0',walletCallbackUrl=null) {
    
    
    const walletSelector = await WalletSelector.new({
        callbackUrl: walletCallbackUrl,
    })
    let wallet = {}
    if (walletSelector.selector.isSignedIn()) {
        wallet = await walletSelector.selector.wallet()
    }
    
    await wallet.signAndSendTransaction({
        receiverId: contractId,
        actions: [{
            type: "FunctionCall",
            params: {
                methodName,
                args,
                gas,
                deposit
            }
        }]
    })

    if (walletCallbackUrl) {
        window.open(walletCallbackUrl,'_self')
        return true
    }
    
    
    
    // if (window.localStorage.getItem("isSender") && window.near.isSignedIn()) {
    //     const res = await window.near.requestSignTransactions({ transactions: [
    //         {
    //             receiverId: contractId,
    //             actions: [{
    //                 methodName,
    //                 args,
    //                 gas,
    //                 deposit
    //             }]
    //         }
    //     ]})
    //     if (res.response?.error || !res.response[0].status) {
    //         return false
    //     }

    //     if (walletCallbackUrl) {
    //         window.open(walletCallbackUrl,'_self')
    //         return true
    //     }
    //     return res.response[0].status
    // } else {
    //     return await account.functionCall({
    //         contractId,
    //         methodName,
    //         args,
    //         gas,
    //         attachedDeposit: deposit,
    //         walletCallbackUrl: walletCallbackUrl
    //     })
    // }
}

export async function executeMultipleTransactions(account, transactions, walletCallbackUrl=null) {

    const walletSelector = await WalletSelector.new({
        callbackUrl: walletCallbackUrl,
    })
    let wallet = {}
    if (walletSelector.selector.isSignedIn()) {
        wallet = await walletSelector.selector.wallet()
    }
    
    const txs = [];
    transactions.forEach(tx => {
        const actions = [];
        tx.actions.forEach(action => {
            actions.push({
                type: "FunctionCall",
                params: {
                    ...action
                }
            })
        })
        txs.push({
            receiverId:tx.receiverId,
            actions:actions,
        })
    })
    await wallet.signAndSendTransactions({ transactions:txs, callbackUrl:walletCallbackUrl })

    if (walletCallbackUrl) {
        window.open(walletCallbackUrl,'_self')
        return true
    }

    // if (window.localStorage.getItem("isSender") && window.near.isSignedIn()) {
    //     const res = await window.near.requestSignTransactions({ transactions:transactions })
    //     if (res.response?.error || !res.response[0].status) {
    //         return false
    //     }

    //     if (walletCallbackUrl) {
    //         window.open(walletCallbackUrl,'_self')
    //         return true
    //     }
    //     return res.response[0].status
    // } else {
    //     const nearTransactions = await Promise.all(
    //         transactions.map((t, i) => {
    //             return createTransaction(account,wallet,{
    //                 receiverId: t.receiverId,
    //                 nonceOffset: i + 1,
    //                 actions: t.actions
    //             });
    //         })
    //     );
    //     await wallet.requestSignTransactions(nearTransactions);
    // }
}

// async function createTransaction(account,wallet,{ receiverId, actions, nonceOffset = 1 }) {
//     actions = await Promise.all(
//         actions.map(async (fc) => {
//             return transaction.functionCall(
//                 fc.methodName,
//                 fc.args,
//                 getGas(fc.gas),
//                 getDeposit(fc.deposit)
//             )
//         })
//     )

//     const accountId = wallet.getAccountId();
//     const localKey = await account.connection.signer.getPublicKey(
//         accountId,
//         config.networkId
//     );
//     const provider = new nearAPI.providers.JsonRpcProvider(config.nodeUrl)
//     const block = await provider.block({ finality: 'final' });
//     const blockHash = baseDecode(block.header.hash);

//     const publicKey = PublicKey.from(localKey);
//     const nonce = block.header.height + nonceOffset          //accessKey.access_key.nonce + nonceOffset;

//     return transaction.createTransaction(
//         accountId,
//         publicKey,
//         receiverId,
//         nonce,
//         actions,
//         blockHash
//     );
// }


