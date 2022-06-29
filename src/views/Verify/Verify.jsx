/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Button, List} from 'antd';
import {connect, WalletConnection, keyStores, KeyPair} from 'near-api-js';
import qs from 'qs';
import {getConfig} from '../../config';
import './Verify.css';
import store from "../../store/discordInfo";
import { getServer, getUser, getConnectedAccount } from '../../api/api';
import { useHistory } from 'react-router-dom'

const config = getConfig()

export default function Index(props) {
    const [near,setNear] = useState({})
    const [wallet,setWallet] = useState({})
    const [serverName,setServerName] = useState('')
    const [displayName,setDisplayName] = useState('')
    const [accountId, setAccountId] = useState('')
    const [avatarURL,setAvatarURL] = useState('')
    const history = useHistory()

    const signIn = async (wallet, type) => {
        if (type == "near") {
            wallet.requestSignIn(
                config.RULE_CONTRACT, // contract requesting access
                "nepbot", // optional
                `${window.location.origin}/wait`, // optional
            );
        } else if (type == "sender") {
            if (typeof window.near == 'undefined' || !window.near.isSender) {
                window.open("https://senderwallet.io/")
                return
            }
            const res = await window.near.requestSignIn({
                contractId: config.RULE_CONTRACT, 
            })
            if (res && res.accessKey) {
                window.localStorage.setItem(`near-api-js:keystore:pending_key${res.accessKey.publicKey}:${config.networkId}`, res.accessKey.secretKey)
                history.push({pathname: `/wait`, search: `account_id=${window.near.accountId}&public_key=${encodeURIComponent(res.accessKey.publicKey)}&all_keys=${encodeURIComponent(res.accessKey.publicKey)}`})
            }
        }  
    };

    const handleConnect = useCallback(async (type) => {
        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,"nepbot");
        console.log(_wallet)
        setNear(_near);
        setWallet(_wallet)
        await signIn(_wallet, type);
    }, [near,wallet])

    const handleDisconnect = useCallback(async () => {
        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,"nepbot");
        if (typeof window.near !== 'undefined' && window.near.isSender && window.near.isSignedIn()) {
            await window.near.signOut()
        }
        await _wallet.signOut()
        setAccountId()
    })

    useEffect(async ()=>{
        const search =  qs.parse(props.location.search.slice(1));
        store.set("info", {
            guild_id: search.guild_id,
            user_id: search.user_id,
            sign: search.sign

        }, { expires: 1 });
        const userInfo = await getUser(search.guild_id, search.user_id, search.sign)
        if (!userInfo) {
            history.push({pathname: '/linkexpired', })
        }
        const accountId = await getConnectedAccount(search.guild_id, search.user_id)
        const serverInfo = await getServer(search.guild_id)
        
        setServerName(serverInfo.name)
        setDisplayName(userInfo.displayName)
        setAvatarURL(userInfo.displayAvatarURL)
        setAccountId(accountId)

        //avatarURL, displayName 
        
    },[])

    function Login() {
        if (accountId == '') {
            return <div></div>
        }
        if (!accountId) {
            return <div>
                <div className={'server-name'}>{serverName}</div>
                <div className={'near-connect-btn'} onClick={() => {handleConnect(("near"))}}>Near Wallet</div>
                <div className={'sw-connect-btn-box'}><div className={'sw-connect-btn'} onClick={() => {handleConnect(("sender"))}}>Sender Wallet</div></div>
                <div className={'tip'}>Connect to your wallet</div>
            </div>
        } else {
            return <div>
            <div className={'account-name'}>{accountId}</div>
            <div className={'server-name'}>{serverName}</div>
            <div className={'disconnect-btn'} onClick={handleDisconnect}>Disconnect</div>
        </div>
        }
        
    }

    return (
        <div className={"verify-box"}>
            <div className={'verify-info'}>
                <img className={'avatar'} src={avatarURL} alt={displayName} hidden={avatarURL == ''}/>
                <div className={'name'}>{displayName}</div>
                
                <Login></Login>
                
            </div>
            
        </div>
    )
}
