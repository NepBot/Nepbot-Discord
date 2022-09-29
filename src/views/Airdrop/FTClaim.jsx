import React, { useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import qs from "qs";
import './Airdrop.css';
import load from '../../assets/images/load.gif';
import {sign} from "../../utils/util";
import { requestTransaction } from '../../utils/contract';
import {getAirdropFTSign} from "../../api/api";
import js_sha256 from "js-sha256";
import bs58 from 'bs58'

const config = getConfig()

export default function Success(props) {
    const history = useHistory();
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
            

            const accountId = wallet.getAccountId()
            const args = {
                user_id: search.user_id,
                guild_id: search.guild_id,
                hash:search.hash,
                sign: search.sign
            }
           
            const signature = await sign(wallet.account(), args)
            const _sign = await getAirdropFTSign({
                args: args,
                account_id: accountId,
                sign: signature
            })
            if(!_sign) {
                history.push({pathname: '/linkexpired', })
                return
            }
            
            // console.log(Buffer.from(JSON.stringify(search.hash+search.user_id+_sign.timestamp)));
            // return;
            

            const res = await requestTransaction(
                account,
                config.AIRDROP_CONTRACT,
                "claim",
                {
                    hash:search.hash,
                    user_id: search.user_id,
                    ..._sign
                },
                '300000000000000',
                '0',
                'https://discord.com/channels/'
            )
            if(window.localStorage.getItem("isSender") && !res){
                history.push({pathname: `/failure`,search:'from=airdrop'})
            }
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    return (
        <div className={'loading-box'}>
            <div className={'loading-content'}>
                <img src={load}/>
                <div className={'text'}>Loading…</div>
            </div>
        </div>

    );
}
