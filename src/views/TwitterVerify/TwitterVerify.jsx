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
                        info = info + item.value + '/\n\n'
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
