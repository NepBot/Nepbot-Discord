import { setupWalletSelector } from "@near-wallet-selector/core";
// import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
import { setupModal } from "@near-wallet-selector/modal-ui-js";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import {getConfig} from "../config";
const config = getConfig()

export default class WalletSelector {
    selector = {}
    modal = {}

    constructor(selector, modal) {
        this.selector = selector
        this.modal = modal
    }

    static async new(options) {
        const selector = await setupWalletSelector({
            network: config.networkId,
            modules: [
              //...(await setupDefaultWallets()),
              setupNearWallet(options),
              setupMyNearWallet(options),
              setupSender(),
              setupHereWallet(options),
              setupMeteorWallet()
            ],
        });
          
        const modal = setupModal(selector, {
            theme: "dark",
            contractId: config.RULE_CONTRACT
        });

        const onSignedIn = async (signedIn) => {
            if (signedIn.walletId == 'sender') {
                const accountId = signedIn.accounts[0].accountId
                console.log(signedIn,window.near.authData)
                window.localStorage.setItem(`near-api-js:keystore:${accountId}:${config.networkId}`, window.near.authData.accessKey.secretKey)
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve()
                    }, 1000)
                })
                if (options.successUrl) {
                    window.location.replace(options.successUrl)
                }
            }else if(signedIn.walletId == 'meteor-wallet'){
                if (options.successUrl) {
                    window.location.replace(options.successUrl)
                }
            }
        }

        selector.on("signedIn", onSignedIn)

        return new WalletSelector(selector, modal)
    }

    async getPrivateKey(accountId) {
        let privateKey = ''
        if(localStorage.getItem("near-wallet-selector:selectedWalletId").replaceAll('"','') == 'meteor-wallet'){
            privateKey = window.localStorage.getItem(`_meteor_wallet${accountId}:${config.networkId}`)
        }else{
            privateKey = window.localStorage.getItem(`near-api-js:keystore:${accountId}:${config.networkId}`)

        }
        return privateKey
    }
}
