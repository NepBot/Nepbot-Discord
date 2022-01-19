import React, { useEffect, useState} from 'react';
import qs from 'qs';
import {notification} from 'antd'
import {setInfo} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";


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
            const params = qs.parse(props.location.search.slice(1))
            console.log(params)
            const signature = await sign(params.account_id)
            const user_id = params.user_id
            const guild_id = params.guild_id
            const datas =  await setInfo({
                account_id: params.account_id, 
                user_id: user_id,
                guild_id: guild_id,
                sign: signature 
            })

            if(datas && datas?.success){
                window.open('https://discord.com/channels/','_self')
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
