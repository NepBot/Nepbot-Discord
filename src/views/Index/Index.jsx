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
import power from '../../assets/imgs/powered_by.svg';
import near_logo from '../../assets/imgs/near_logo.svg';

export default function Index(props) {

    return (
        <div className={"wrap"}>
            <div className={"cover-box"}>
                <img className={"cover"} src={cover1}/>
                <a className={"nav-btn invite"} href='https://discord.com/api/oauth2/authorize?client_id=928559137179172874&permissions=8&scope=bot' target="view_window"></a>
                <a className={"nav-btn commands"} href='https://nepbot.notion.site/Command-Glossary-e5ffdf2d51e24fc0a569d1cb3ef6e035' target="view_window"></a>
                <a className={"nav-btn faq"} href='https://nepbot.notion.site/Discord-NepBot-Knowledge-Base-dc875fc6c3f84149aa8a76ef7a2a23ab' target="view_window"></a>
                <a className={"nav-btn community"} href='https://discord.gg/QdQdHm5Tvm' target="view_window"></a>
                <a className={"invite-btn"} href='https://discord.com/api/oauth2/authorize?client_id=928559137179172874&permissions=8&scope=bot' target="view_window"></a>
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
                <a className={"twitter"} href="https://twitter.com/nepbot4near" target="view_window"></a>
                <a className={"github"} href="https://github.com/NepBot" target="view_window"></a>
                <a className={"discord"} href="https://discord.gg/QdQdHm5Tvm" target="view_window"></a>
            </div>
            <div className={"power-box"}>
                <img src={power}/>
                <img src={near_logo}/>
                <a href="https://near.org" target="view_window"></a>
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
