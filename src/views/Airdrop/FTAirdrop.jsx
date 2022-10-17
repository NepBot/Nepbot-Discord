import React, { useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import qs from "qs";
import './Airdrop.css';
import load from '../../assets/images/load.gif';
import {parseAmount} from "../../utils/util";
import js_sha256 from "js-sha256";
import bs58 from 'bs58'
import {executeMultipleTransactions } from '../../utils/contract';
import {sendftmsg} from "../../api/api";

const config = getConfig()

export default function Success(props) {
    const history = useHistory();
    useEffect(()=>{
        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            const account = wallet.account(); 

            const checkResult = async () => {
                const hash = localStorage.getItem(`nepbot_airdrop_${search.user_id}`);
                const res = await sendftmsg({
                    guild_id:search.guild_id,
                    channel_id:search.channel_id,
                    role_id:search.role_id,
                    token_id:search.token_id,
                    total_amount: search.total_amount, 
                    amount_per_share:search.amount_per_share,
                    end_time:search.end_time,
                    hash,
                }) 
                if(res){
                    window.open('https://discord.com/channels/','_self')
                }else{
                    history.push({pathname: `/failure`,search:'from=airdrop'})
                }
            }

            try {
                await wallet._completeSignInWithAccessKey()
            } catch {}

            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return
            }

            const metadata = await account.viewFunction(search.token_contract, 'ft_metadata', {})


            if(!window.localStorage.getItem("isSender") && search.transactionHashes){
                await checkResult();
                return;
            }else{
                const args = {
                    claim_amount: parseAmount(search.amount_per_share, metadata.decimals),
                    deposit:{
                        FT:[search.token_contract,parseAmount(search.total_amount, metadata.decimals)]
                    },
                    end_time: String(new Date(search.end_time).getTime() * 1000000),
                    guild_id: search.guild_id,
                    role_ids: [search.role_id],
                    start_time: String(new Date().getTime() * 1000000),
                }
                const hash = bs58.encode(js_sha256.array(Buffer.from(JSON.stringify(args))));
                localStorage.setItem(`nepbot_airdrop_${search.user_id}`,hash);
                const isRegistered = await account.viewFunction(search.token_contract, 'storage_balance_of', {account_id: config.AIRDROP_CONTRACT})

                let txs = [];
                if(!isRegistered){
                    txs = [{
                        receiverId: search.token_contract,
                        actions: [{
                            methodName: "storage_deposit",
                            args: {
                                account_id:config.AIRDROP_CONTRACT
                            },
                            deposit: '12500000000000000000000',
                            gas: '300000000000000'
                        }]
                    }]
        
                }

                txs = txs.concat([{
                    receiverId:config.AIRDROP_CONTRACT,
                    actions:[{
                        args: {
                            campaign:args
                        },
                        deposit: "8000000000000000000000",
                        gas: "100000000000000",
                        kind: "functionCall",
                        methodName: "add_campaign"
                    }]
                },{
                    receiverId:search.token_contract,
                    actions:[{
                        args: {
                            receiver_id:config.AIRDROP_CONTRACT,
                            amount:parseAmount(search.total_amount, metadata.decimals),
                            msg:hash
                        },
                        deposit: "1",
                        gas: "100000000000000",
                        kind: "functionCall",
                        methodName: "ft_transfer_call"
                    }]
                }])
                
                // console.log(txs); return;
                const result = await executeMultipleTransactions(account,wallet,txs);
                if(window.localStorage.getItem("isSender") && result){
                    await checkResult();
                }
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
