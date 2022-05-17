import React, { useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {getMintSign, setInfo} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import qs from "qs";
import './Mint.css';
import load from '../../assets/images/load.gif';

const config = getConfig()

export default function Success(props) {
    const history = useHistory()
    useEffect(()=>{

        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            store.set("info", {
                guild_id: search.guild_id,
                user_id: search.user_id,
                collection_id: search.collection_id,
                sign: search.sign
            }, { expires: 1 });

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
                collection_id: search.collection_id,
                sign: search.sign
            }
           
            const signature = await sign(wallet.account(), args)
            const _sign = await getMintSign({
                args: args,
                account_id: accountId,
                sign: signature
            })
            if(!_sign) {
                history.push({pathname: '/linkexpired', })
                return
            }

            await account.functionCall({
                contractId: config.NFT_CONTRACT,
                methodName: "nft_mint",
                args: {
                    collection_id: search.collection_id,
                    ..._sign
                },
                attachedDeposit: '90000000000000000000000'
            })
                
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
