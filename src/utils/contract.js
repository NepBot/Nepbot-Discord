
export async function requestTransaction(account, contractId, methodName, args, gas='300000000000000', deposit='0',walletCallbackUrl=null) {
    if (window.localStorage.getItem("isSender") && window.near.isSignedIn()) {
        const res = await window.near.requestSignTransactions({ transactions: [
            {
                receiverId: contractId,
                actions: [{
                    methodName,
                    args,
                    gas,
                    deposit
                }]
            }
        ]})
        
        if (!res.response[0].status) {
            return false
        }

        if (walletCallbackUrl) {
            window.open(walletCallbackUrl,'_self')
            return true
        }
        return res.response[0].status
    } else {
        return await account.functionCall({
            contractId,
            methodName,
            args,
            gas,
            attachedDeposit: deposit,
        })
    }
}