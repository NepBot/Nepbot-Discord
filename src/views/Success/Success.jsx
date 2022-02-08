import React, { useEffect, useState} from 'react';
import qs from 'qs';
import {notification} from 'antd'
import {setInfo} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {config} from "../../config";


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
            console.log(datas)
            if(datas && datas?.success){
                console.log(params)
                if (!params.redirect) {
                    window.open('https://discord.com/channels/','_self')
                } else if (params.redirect == "setrule") {
                    window.open(`${window.location.origin}/setrule?user_id=${params.user_id}&guild_id=${params.guild_id}&guild_name=${params.guild_name}`,'_self')
                }
                
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
        <div className={'success_content'}>
            <p style={{textAlign:'center',fontSize:'30px'}}>  {'success'}</p>
            {/* eslint-disable-next-line no-mixed-operators */}
            {/*{!st && <Button style={{textAlign:'center',margin:"0 auto",display:'block'}} type={'primary'} danger size={"large"} onClick={handleDiscord}>discord</Button>||null}*/}
        </div>
    );
}
