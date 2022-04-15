import React, { useEffect, useState} from 'react';
import qs from 'qs';
import {notification} from 'antd'
import {setInfo} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import './success.css';
import bg_left_top from '../../assets/imgs/bg_left_top.svg';
import bg_right_bottom from '../../assets/imgs/bg_right_bottom.svg';
import success from '../../assets/imgs/success.svg';

const config = getConfig()

export default function Success(props) {

    useEffect(()=>{

        (async ()=>{
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const accountId = wallet.getAccountId()
            const params = store.get("info")
            const args = {
                account_id: accountId, 
                user_id: params.user_id,
                guild_id: params.user_id,
                sign: params.sign
            }
            
            const signature = await sign(wallet.account(), args)
            await setInfo({
                args: args,
                account_id: accountId,
                sign: signature 
            })
            window.open('https://discord.com/channels/','_self')
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    // const handleDiscord = useCallback(()=>{
    //     window.open('https://discord.com/channels/','_self')
    // },[])

    return (
        <div className={'success-box'}>
            <img className="bg-left-top" src={bg_left_top}/>
            <div className={'success-content'}>
                <img src={success}/>
            </div>
            <img className="bg-right-bottom" src={bg_right_bottom}/>
        </div>

    );
}
