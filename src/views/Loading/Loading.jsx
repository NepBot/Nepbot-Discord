import React, { useEffect, useState} from 'react';
import {setInfo} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import './Loading.css';
import load from '../../assets/images/load.gif';
import { useHistory } from 'react-router-dom'
import qs from 'qs';
import WalletSelector from '../../utils/walletSelector';

const config = getConfig()

export default function Success(props) {
    const history = useHistory()
    useEffect(()=>{

        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            // if (search.account_id) {
            //     localStorage.removeItem("nepbot_wallet_auth_key")
            // }
            const walletSelector = await WalletSelector.new()
            const wallet = await walletSelector.selector.wallet()
            const accountId = (await wallet.getAccounts())[0].accountId
            const privateKey = await walletSelector.getPrivateKey(accountId)
            // if (walletSelector.selector.isSignedIn()) {
            //     const wallet = await walletSelector.selector.wallet()
            // }
            // const near = await connect(config);
            // const wallet = new WalletConnection(near,"near_app");
            // try {
            //     await wallet._completeSignInWithAccessKey()
            // } catch {}
            
            const params = store.get("info")
            const args = {
                account_id: accountId, 
                user_id: params.user_id,
                guild_id: params.guild_id,
                sign: params.sign
            }
            const signature = await sign(privateKey, args)
            let result = await setInfo({
                args: args,
                account_id: accountId,
                sign: signature 
            })
            if (result == true) {
                history.push({pathname: `/success`})
                // window.open('https://discord.com/channels/','_self')
            } else {
                history.push({pathname: `/failure`})
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
