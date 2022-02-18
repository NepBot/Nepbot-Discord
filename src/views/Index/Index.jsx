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

    return (
        <div className={"wrap"}>
            <div className={"cover-box"}>
                <img className={"cover"} src={cover1}/>
                <a className={"nav-btn invite"} href='https://discord.com/api/oauth2/authorize?client_id=928559137179172874&permissions=8&scope=bot' ></a>
                <a className={"nav-btn commands"} href='https://www.notion.so/bepopula/Command-Glossary-78b5c08de0ee4c399e646976866be6a4' ></a>
                <a className={"nav-btn faq"} href='https://www.notion.so/bepopula/Discord-NepBot-Knowledge-Base-78abb8b9570b4e1f8bedd8cdf912d055' ></a>
                <a className={"nav-btn community"} href='https://discord.gg/QdQdHm5Tvm' ></a>
                <a className={"invite-btn"} href='https://discord.com/api/oauth2/authorize?client_id=928559137179172874&permissions=8&scope=bot' ></a>
            </div>
            <div className={"cover-box"}>
                <img className={"cover"} src={cover2}/>
                <div className={"cover-start-box"}>
                    <img className={"cover"} src={cover_start}/>
                    <a className={"start-btn"} href='https://discord.com/api/oauth2/authorize?client_id=928559137179172874&permissions=8&scope=bot' ></a>
                </div>
            </div>
            <div className={"media-box"}>
                <img className={"cover"} src={media}/>
                <a className={"twitter"} href="https://twitter.com/nepbot4near"></a>
                <a className={"github"} href="https://github.com/NepBot"></a>
                <a className={"discord"} href="https://discord.gg/QdQdHm5Tvm"></a>
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
