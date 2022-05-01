/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Button, List} from 'antd';
import {connect, WalletConnection} from 'near-api-js';
import qs from 'qs';
import {getConfig} from '../../config';
import './Oauth.css';
import store from "../../store/discordInfo";
import { getServer, getUser } from '../../api/api';

const config = getConfig()

export default function Index(props) {
    const [near,setNear] = useState({})
    const [wallet,setWallet] = useState({})
    const [serverName,setServerName] = useState('')
    const [displayName,setDisplayName] = useState('')
    const [avatarURL,setAvatarURL] = useState('')

    const signIn = (wallet) => {
        wallet.requestSignIn(
          "", // contract requesting access
          "nepbot", // optional
          `${window.location.origin}/wait`, // optional
          `${window.location.origin}/failure` // optional
        );
    };

    const handleConnect = useCallback(async () => {
        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,"nepbot");
        setNear(_near);
        setWallet(_wallet)
        signIn(_wallet);
    }, [near,wallet])

    useEffect(async ()=>{
        const search =  qs.parse(props.location.search.slice(1));
        store.set("info", {
            redirect: search.redirect,
            guild_id: search.guild_id,
            user_id: search.user_id,
            guild_name: search.guild_name
        }, { expires: 1 });
        const serverInfo = await getServer(search.guild_id)
        const userInfo = await getUser(search.guild_id, search.user_id)
        setServerName(serverInfo.name)
        setDisplayName(userInfo.displayName)
        setAvatarURL(userInfo.displayAvatarURL)
        //avatarURL, displayName 
        
    },[])

    return (
        <div className={"oauth-box"}>
            <div className={'oauth-info'}>
                <img className={'avatar'} src={avatarURL} alt={displayName}/>
                <div className={'name'}>{displayName}</div>
                <div className={'server-name'}>{serverName}</div>
                <div className={'connect-btn'} onClick={handleConnect}>Connect</div>
                <div className={'tip'}>Connect to your Near wallet</div>
            </div>
            
        </div>
    )
}
