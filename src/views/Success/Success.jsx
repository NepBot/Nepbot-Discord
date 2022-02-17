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

    const openNotificationWithIcon = type => {
        notification[type]({
            message: 'Important information is missing',
            description:
                'Please close the current page and return to discord to restart wallet authorization',
        });
    };



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
            const datas =  await setInfo({
                args: args,
                account_id: account_id,
                sign: signature 
            })
            
            if(datas && datas?.success){
                // console.log(params)
                // if (!params.redirect) {
                //     window.open('https://discord.com/channels/','_self')
                // } else if (params.redirect == "setrule") {
                //     window.open(`${window.location.origin}/setrule?user_id=${params.user_id}&guild_id=${params.guild_id}&guild_name=${params.guild_name}`,'_self')
                // }
                
                // openNotificationWithIcon('error');
            }else{
                openNotificationWithIcon('error');
                // setSt(true)
            }
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    // const handleDiscord = useCallback(()=>{
    //     window.open('https://discord.com/channels/','_self')
    // },[])

    return (
        <div className={'success-box'}>
            <img class="bg-left-top" src={bg_left_top}/>
            <div className={'success-content'}>
                <img src={success}/>
            </div>
            <img class="bg-right-bottom" src={bg_right_bottom}/>
        </div>

    );
}
