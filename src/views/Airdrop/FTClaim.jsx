import React, { useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {connect, WalletConnection, keyStores} from "near-api-js";
import WalletSelector from '../../utils/walletSelector';
import {getConfig} from "../../config";
import qs from "qs";
import './Airdrop.css';
import load from '../../assets/images/load.gif';
import {sign} from "../../utils/util";
import { requestTransaction, executeMultipleTransactions } from '../../utils/contract';
import {getAirdropFTSign} from "../../api/api";
import js_sha256 from "js-sha256";
import bs58 from 'bs58'

const config = getConfig()

export default function Success(props) {
    const history = useHistory();
    useEffect(()=>{

        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            // const near = await connect(config);
            // const wallet = new WalletConnection(near, 'nepbot');
            // const account = wallet.account(); 

            const walletSelector = await WalletSelector.new({})
            if (!walletSelector.selector.isSignedIn()) {
                const selector = document.getElementById("near-wallet-selector-modal");
                walletSelector.modal.show();
                selector.getElementsByClassName('nws-modal-overlay')[0].style.display= 'none';
                selector.getElementsByClassName('close-button')[0].style.display= 'none';
                return
            }
            const wallet = await walletSelector.selector.wallet()
            const accountId = (await wallet.getAccounts())[0].accountId
            const privateKey = await walletSelector.getPrivateKey(accountId)
            const keyStore = new keyStores.InMemoryKeyStore();
            const near = await connect({
                keyStore,
                ...config,
            });
            const account = await near.account();
            

            // const accountId = wallet.getAccountId()
            const args = {
                user_id: search.user_id,
                guild_id: search.guild_id,
                hash:search.hash,
                sign: search.sign
            }
           
            const signature = await sign(privateKey, args)
            const _sign = await getAirdropFTSign({
                args: args,
                account_id: accountId,
                sign: signature
            })
            if(!_sign) {
                history.push({pathname: '/linkexpired', })
                return
            }
            
            const campaignInfo = await account.viewFunction(config.AIRDROP_CONTRACT, "get_campaign", {hash: search.hash})
            const contractId = campaignInfo.deposit.FT.contract_id
            const isRegistered = await account.viewFunction(contractId, 'storage_balance_of', {account_id: accountId})
            let txs = [];
            if(!isRegistered){
                txs.push({
                    receiverId: contractId,
                    actions: [{
                        methodName: "storage_deposit",
                        args: {
                            account_id:accountId
                        },
                        deposit: '12500000000000000000000',
                        gas: '300000000000000'
                    }]
                })
            }
            txs.push({
                receiverId:config.AIRDROP_CONTRACT,
                actions:[{
                    methodName: "claim",
                    args: {
                        hash:search.hash,
                        user_id: search.user_id,
                        ..._sign
                    },
                    deposit: "0",
                    gas: "300000000000000",
                }]
            })
            const res= await executeMultipleTransactions(account,txs,'https://discord.com/channels/');

            // const res = await requestTransaction(
            //     account,
            //     config.AIRDROP_CONTRACT,
            //     "claim",
            //     {
            //         hash:search.hash,
            //         user_id: search.user_id,
            //         ..._sign
            //     },
            //     '300000000000000',
            //     '0',
            //     'https://discord.com/channels/'
            // )

            if(!res){
                history.push({pathname: `/failure`,search:'from=airdrop'})
            }
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    return (
        <div className={'loading-box'}>
            <div className={'loading-content'}>
                <img src={load}/>
                <div className={'text'}>Loading…</div>
            </div>
        </div>

    );
}
