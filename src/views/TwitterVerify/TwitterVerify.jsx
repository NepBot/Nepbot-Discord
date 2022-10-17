import React, { useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import qs from "qs";
import './TwitterVerify.css';
import load from '../../assets/images/load.gif';
import {twitterVerify} from "../../api/api";

const config = getConfig()

export default function Success(props) {
    const history = useHistory();
    useEffect(()=>{
        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            if(!search.state || !search.code){
                history.push({pathname: `/failure`})
            }


            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            try {
                await wallet._completeSignInWithAccessKey()
            } catch {}
            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return 
            }


            const res = await twitterVerify({state:search.state,code:search.code});
            if(typeof(res) == 'object' && res.length>0){
                let info = ''
                if(res[0]['name'] == 'Add role success' || res[0]['name'] == 'Already in role'){
                    localStorage.setItem('twitterVerifyInfo',res[0]['value'])
                    history.push({pathname: `/success`,search:'from=twitterverify'})
                }else{
                    res.forEach(item=>{
                        if(item.value.indexOf('https://')>-1){
                            const infoArr = item.value.split("https://");
                            const url = `https://${infoArr[1]}`
                            if(infoArr[0].indexOf('Must:')>-1){
                                const txtArr = infoArr[0].split("Must:");
                                info += `${txtArr[0]} <br/> Must:${txtArr[1]} <a href="${url}" target="_blank">${url}</a> <br/><br/>`
                            }else{
                                info += `${infoArr[0]} <a href="${url}" target="_blank">${url}</a> <br/><br/>`
                            }
                        }else{
                            if(item.value.indexOf('Must:')>-1){
                                const txtArr = item.value.split("Must:");
                                info += `${txtArr[0]} <br/> Must:${txtArr[1]} <br/><br/>`
                            }else{
                                info += `${item.value} <br/><br/>`
                            }
                        }
                    })
                    localStorage.setItem('twitterVerifyInfo',info)
                    history.push({pathname: `/failure`,search:'from=twitterverify&status=1'})
                }
            }else{
                history.push({pathname: `/failure`,search:'from=twitterverify&status=0'})
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
