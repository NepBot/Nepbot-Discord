import React, { useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import qs from "qs";
import './Snapshot.css';
import load from '../../assets/images/load.gif';
import {sign} from "../../utils/util";
import { requestTransaction } from '../../utils/contract';
import {getSnapshotSign} from "../../api/api";

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
                contract_address: search.contract_address,
                sign: search.sign
            }
           
            const signature = await sign(wallet.account(), args)
            const _sign = await getSnapshotSign({
                args: args,
                account_id: accountId,
                sign: signature
            })
            if(!_sign) {
                history.push({pathname: '/linkexpired', })
                return
            }
            

            const res = await requestTransaction(
                account,
                config.SNAPSHOT_CONTRACT,
                "set_snapshot",
                {
                    contract_address: search.contract_address,
                    ..._sign
                },
                '300000000000000',
                '0',
                'https://discord.com/channels/'
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
