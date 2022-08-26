import React, { useEffect} from 'react';
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import qs from "qs";
import './Vote.css';
import load from '../../assets/images/load.gif';
import { requestTransaction } from '../../utils/contract';

const config = getConfig()

export default function Success(props) {
    useEffect(()=>{

        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            const account = wallet.account(); 

            try {
                await wallet._completeSignInWithAccessKey()
            } catch {}

            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return
            }
            
  
            const res = await requestTransaction(
                account,
                search.contract_address,
                "act_proposal",
                {
                    id: Number(search.proposal_id),
                    action:search.action
                },
                '300000000000000',
                '0',
                `${config.ASTRO}/dao/${search.contract_address}/proposals/${search.contract_address}-${search.proposal_id}`
            )
                
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
