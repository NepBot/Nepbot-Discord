import React, { useEffect, useState} from 'react';
import {setInfo} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import './Loading.css';
import load from '../../assets/images/load.gif';

const config = getConfig()

export default function Success(props) {
    useEffect(()=>{

        (async ()=>{
            window.localStorage.remove("nepbot_wallet_auth_key")
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const accountId = wallet.getAccountId()
            const params = store.get("info")
            const args = {
                account_id: accountId, 
                user_id: params.user_id,
                guild_id: params.guild_id,
                sign: params.sign
            }
            
            const signature = await sign(wallet.account(), args)
            let result = await setInfo({
                args: args,
                account_id: accountId,
                sign: signature 
            })
            if (!result) {
                window.location.href = `${window.location.origin}/failure`
                console.log("============================")
            } else {
                //window.open('https://discord.com/channels/','_self')
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
