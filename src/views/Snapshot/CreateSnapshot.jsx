import React, { useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {connect, WalletConnection} from "near-api-js";
import * as nearAPI from 'near-api-js';
import {getConfig} from "../../config";
import {Base64} from 'js-base64';
import qs from "qs";
import './Snapshot.css';
import load from '../../assets/images/load.gif';
import {sign} from "../../utils/util";
import { requestTransaction } from '../../utils/contract';
import {getSnapshotSign,sendmsgSnapshot} from "../../api/api";

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
                const provider = new nearAPI.providers.JsonRpcProvider(config.nodeUrl)
                const txRes = await provider.txStatus(search.transactionHashes, wallet.getAccountId())
                const res = await sendmsgSnapshot({
                    guild_id: search.guild_id,
                    channel_id:search.channel_id,
                    hash:Base64.decode(txRes.status.SuccessValue).replaceAll("\"",""),
                }) 
                if(res){
                    window.open('https://discord.com/channels/','_self')
                }else{
                    history.push({pathname: `/failure`})
                }
            }

            try {
                await wallet._completeSignInWithAccessKey()
            } catch {}

            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return
            }

            
            if(!window.localStorage.getItem("isSender") && search.transactionHashes){
                await checkResult();
                return;
            }else{
                const accountId = wallet.getAccountId()
                const args = {
                    user_id: search.user_id,
                    guild_id: search.guild_id,
                    contract_address: search.contract_address,
                    sign: search.sign
                }
                const signature = await sign(wallet.account(), args)
                const _sign = await getSnapshotSign({
                    args: args,
                    account_id: accountId,
                    sign: signature
                })
                if(!_sign) {
                    history.push({pathname: '/linkexpired', })
                    return
                }
                const res = await requestTransaction(
                    account,
                    config.SNAPSHOT_CONTRACT,
                    "set_snapshot",
                    {
                        contract_address: search.contract_address,
                        ..._sign
                    },
                    '300000000000000',
                    '0',
                    ''
                )
                if(window.localStorage.getItem("isSender") && res){
                    await checkResult();
                }
            }
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    // const handleDiscord = useCallback(()=>{
    //     window.open('https://discord.com/channels/','_self')
    // },[])

    return (
        <div className={'loading-box'}>
            <div className={'loading-content'}>
                <img src={load}/>
                <div className={'text'}>Loading…</div>
            </div>
        </div>

    );
}
