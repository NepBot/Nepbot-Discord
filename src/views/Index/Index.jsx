/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Button, List} from 'antd';
import {connect, WalletConnection} from 'near-api-js';
import qs from 'qs';
import {config} from '../../config';
import './Index.css';
import store from "../../store/discordInfo";
import cover1 from '../../assets/imgs/index/cover1.svg';
import cover2 from '../../assets/imgs/index/cover2.svg';
import cover_start from '../../assets/imgs/index/cover_start.svg';
import media from '../../assets/imgs/index/media.svg';


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

    useEffect(()=>{
        const search =  qs.parse(props.location.search.slice(1));
        store.set("info", {

            redirect: search.redirect,
            guild_id: search.guild_id,
            user_id: search.user_id,
            guild_name: search.guild_name
        }, { expires: 1 });
        //window.location.replace(window.location.href.replace(window.location.search, ""));
    },[])

    return (
        <div className={"wrap"}>
            <div className={"cover-box"}>
                <img className={"cover"} src={cover1}/>
                <a className={"nav-btn invite"} href='' ></a>
                <a className={"nav-btn commands"} href='' ></a>
                <a className={"nav-btn faq"} href='' ></a>
                <a className={"nav-btn community"} href='' ></a>
                <a className={"invite-btn"} href='' ></a>
            </div>
            <div className={"cover-box"}>
                <img className={"cover"} src={cover2}/>
                <div className={"cover-start-box"}>
                    <img className={"cover"} src={cover_start}/>
                    <a className={"start-btn"} href='' ></a>
                </div>
            </div>
            <div className={"media-box"}>
                <img className={"cover"} src={media}/>
                <a className={"twitter"} href=""></a>
                <a className={"github"} href=""></a>
                <a className={"discord"} href=""></a>
            </div>
            
            {/* <div className={'content'}>
                <div className={'text'}>
                    vera
                </div>
            </div>
            <div className={'title'}>Connect to your Near wallet</div>
            <Button className={'connect'} type={'primary'}
                        onClick={handleConnect}>Connect</Button> */}
            
        </div>
    )
}
