/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Button, List} from 'antd';
import {connect, WalletConnection} from 'near-api-js';
import qs from 'qs';
import {config} from '../../config';
import './Oauth.css';
import store from "../../store/discordInfo";
import bg_top from '../../assets/imgs/bg_top.svg';
import bg_right from '../../assets/imgs/bg_right.svg';
import { getServer, getUser } from '../../api/api';


export default function Index(props) {
    const [near,setNear] = useState({})
    const [wallet,setWallet] = useState({})

    const signIn = (wallet) => {
        wallet.requestSignIn(
          config.RULE_CONTRACT, // contract requesting access
          "nepbot", // optional
          `${window.location.origin}/success`, // optional
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
        console.log(userInfo)
        //avatarURL, displayName 
        
    },[])

    return (
        <div className={"oauth-box"}>
            <img className="bg-top" src={bg_top}/>
            <div className={'oauth-content'}>
                <div className={'text'}>
                    vera
                </div>
                <div className={'title'}>Connect to your Near wallet</div>
                <Button className={'connect'} type={'primary'}
                        onClick={handleConnect}>Connect</Button>
            </div>
            <img className="bg-right" src={bg_right}/>
            
        </div>
    )
}
