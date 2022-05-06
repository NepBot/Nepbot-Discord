import React, { useEffect, useState} from 'react';
import {setInfo} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import './LinkExpired.css';
import link_expired from '../../assets/images/link-expired.png';

const config = getConfig()

export default function Success(props) {

    useEffect(()=>{

        (async ()=>{
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const account_id = wallet.getAccountId()
            const params = store.get("info")
            // const accoutState = await wallet.account().state()
            // console.log(accoutState)
            // const user_id = params.user_id
            // const guild_id = params.guild_id

            // const args = {
            //     account_id: account_id, 
            //     user_id: user_id,
            //     guild_id: guild_id,
            // }
            
            // const signature = await sign(wallet.account(), args)
            // await setInfo({
            //     args: args,
            //     account_id: account_id,
            //     sign: signature 
            // })
            // window.open('https://discord.com/channels/','_self')
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    // const handleDiscord = useCallback(()=>{
    //     window.open('https://discord.com/channels/','_self')
    // },[])

    return (
        <div className={'link-box'}>
            <div className={'link-content'}>
                <img src={link_expired}/>
                <div className={'text'}>Link expired</div>
                <div className={'tip'}>Please create a new link.</div>
            </div>
        </div>

    );
}
