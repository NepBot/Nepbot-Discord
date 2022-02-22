import React, { useEffect, useState} from 'react';
import qs from 'qs';
import {notification} from 'antd'
import {setInfo} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {config} from "../../config";
import './success.css';
import bg_left_top from '../../assets/imgs/bg_left_top.svg';
import bg_right_bottom from '../../assets/imgs/bg_right_bottom.svg';
import success from '../../assets/imgs/success.svg';


export default function Success(props) {

    useEffect(()=>{

        (async ()=>{
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const account_id = wallet.getAccountId()
            const params = store.get("info")
            const accoutState = await wallet.account().state()
            console.log(accoutState)
            const user_id = params.user_id
            const guild_id = params.guild_id

            const args = {
                account_id: account_id, 
                user_id: user_id,
                guild_id: guild_id,
            }
            
            const signature = await sign(wallet.account(), args)
            await setInfo({
                args: args,
                account_id: account_id,
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
