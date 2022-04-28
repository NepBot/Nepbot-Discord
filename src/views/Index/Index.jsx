/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import './Index.css';
import cover1 from '../../assets/imgs/index/cover1.svg';
import cover2 from '../../assets/imgs/index/cover2.svg';
import cover_start from '../../assets/imgs/index/cover_start.svg';
import cover_mainnet from '../../assets/imgs/index/cover_start_mainnet.svg';
import media from '../../assets/imgs/index/media.svg';
import near_logo from '../../assets/imgs/index/nearlogo.svg';
import {getConfig} from '../../config.js';

let config = getConfig()

export default function Index(props) {
    const invite_url = `https://discord.com/api/oauth2/authorize?client_id=${config.APPLICATION_ID}&permissions=8&scope=bot`
    let cover_bottom = cover_start;
    let href = "/claim"
    if (config.networkId == 'mainnet') {
        cover_bottom = cover_mainnet;
        href = invite_url 
    }

    return (
        <div className={"wrap"}>
            <div className={"cover-box"}>
                <img className={"cover"} src={cover1}/>
                <a className={"nav-btn invite"} href={invite_url} target="view_window"></a>
                <a className={"nav-btn commands"} href='https://nepbot.notion.site/Command-Glossary-e5ffdf2d51e24fc0a569d1cb3ef6e035' target="view_window"></a>
                <a className={"nav-btn faq"} href='https://nepbot.notion.site/Discord-NepBot-Knowledge-Base-dc875fc6c3f84149aa8a76ef7a2a23ab' target="view_window"></a>
                <a className={"nav-btn community"} href='https://discord.gg/avqufmzS6t' target="view_window"></a>
                <a className={"invite-btn"} href={invite_url} target="view_window"></a>
            </div>
            <div className={"cover-box"}>
                <img className={"cover"} src={cover2}/>
                <div className={"cover-start-box"}>
                    <img className={"cover"} src={cover_bottom}/>
                    <a className={"start-btn"} href={href} ></a>
                </div>
            </div>
            <div className={"media-box"}>
                <img className={"cover"} src={media}/>
                <a className={"twitter"} href="https://twitter.com/nepbot4near" target="view_window"></a>
                <a className={"github"} href="https://github.com/NepBot" target="view_window"></a>
                <a className={"discord"} href="https://discord.gg/avqufmzS6t" target="view_window"></a>
            </div>
            <div className={"power-box"}>
                <img className={"cover"} src={near_logo}/>
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
