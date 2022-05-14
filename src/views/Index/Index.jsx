/* eslint-disable react-hooks/exhaustive-deps */
import store from "../../store/discordInfo";
import React, {useCallback, useEffect, useState} from 'react';
import {Select} from "antd";
import './Index.css';
import {getConfig} from '../../config.js';


import logo from '../../assets/images/index/logo.png';
import banner from '../../assets/images/index/banner.png';
import roleupdate from '../../assets/images/index/roleupdate.png';
import verfication from '../../assets/images/index/verfication.png';
import workInvite from '../../assets/images/index/work-invite.png';
import workRule from '../../assets/images/index/work-rule.png';
import workConnect from '../../assets/images/index/work-connect.png';
import fusotao from '../../assets/images/index/logo-fusotao.png';
import flux from '../../assets/images/index/logo-flux.png';
import QSTN from '../../assets/images/index/logo-QSTN.png';
import OCT from '../../assets/images/index/logo-OCT.png';
import near from '../../assets/images/index/logo-near.png';
import near_large from '../../assets/images/index/logo-near-large.png';
const { Option } = Select;
// let config = getConfig()

export default function Index(props) {
    const initNetwork = store.get("network") || 'mainnet';
    store.set("network", initNetwork, { expires: 1 });
    const getInviteUrl = (network) => {
        const config = getConfig()
        if(network === 'mainnet'){
            return `https://discord.com/api/oauth2/authorize?client_id=${config.APPLICATION_ID}&permissions=8&scope=bot`
        }else{
            return `https://discord.com/api/oauth2/authorize?client_id=${config.APPLICATION_ID}&permissions=8&scope=bot%20applications.commands`
        }
    }

    const network = store.get("network")
    const [networkId,setNetwork] = useState(network)
    const [inviteUrl,setInviteUrl] = useState(getInviteUrl(network))
    const handleChange = (value) => {
        store.set("network", value, { expires: 1 });
        setNetwork(value)
        setInviteUrl(getInviteUrl(value))
        store.remove("info");
        store.remove("guild_id");
    }

    return (
        <div className={"wrap"}>
            <div className={'bg'}></div>
            <div className={"main"}>
                <div className={"header"}>
                    <img className={"logo"} src={logo}/>
                    <div className={"nav"}>
                        <a className={"nav-item invite"} href={inviteUrl} target="view_window">Invite</a>
                        <a className={"nav-item commands"} href='https://nepbot.notion.site/Command-Glossary-e5ffdf2d51e24fc0a569d1cb3ef6e035' target="view_window">Commands</a>
                        <a className={"nav-item faq"} href='https://nepbot.notion.site/Discord-NepBot-Knowledge-Base-dc875fc6c3f84149aa8a76ef7a2a23ab' target="view_window">FAQ</a>
                        <a className={"nav-item community"} href='https://discord.gg/avqufmzS6t' target="view_window">Community</a>
                        <div className={[networkId,'nav-item'].join(' ')} >
                            <Select value={networkId} dropdownClassName={"network-dropdown"} onChange={handleChange}>
                                <Option value='mainnet' key='mainnet'>Mainnet</Option>
                                <Option value='testnet' key='testnet'>TestNet</Option>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className={"banner-box"}>
                    <img className={"banner"} src={banner}/>
                    <div className={"banner-content"}>
                        <div className={"title"}>Nepbot</div>
                        <div className={"intro"}>Build up token gated discord experiences on <br/>Near</div>
                        <a className={"invite-btn"} href={inviteUrl} target="view_window">Invite</a>
                    </div>
                </div>
                <div className={"content"}>
                    <div className={"title"}>Feature💥</div>
                    <div className={"intro"}>Build your tokenized communities,join millions of Near users across web2 and web3.</div>
                    <div className={"feature-box"}>
                        <div className={"feature"}>
                            <img className={"icon"} src={verfication} alt="Verfication"/>
                            <div className={"title"}>Verfication</div>
                            <div className={"info"}>Link your Discord account with your Near wallet,set token threshold roles and make your channels exclusive!</div>
                            <div className={"list"}>
                                <div className={"item"}>Fungible token</div>
                                <div className={"item"}>Non Fungible token</div>
                                <div className={"item"}>Staking status</div>
                            </div>
                        </div>
                        <div className={"feature"}>
                            <img className={"icon"} src={roleupdate} alt="Roleupdate"/>
                            <div className={"title"}>Role Update</div>
                            <div className={"info"}>Set up tokenized rules for roles and build a space for token holders.Nepbot regularly checks the balance and status in all verified accounts in joined servers,making sure roles are constantly updated.</div>
                        </div>
                    </div>

                    <div className={"title work-title"}>Hoe does it work?🔥</div>
                    <div className={"work-list"}>
                        <div className={"txt"}>
                            <div className={"title"}>Invite Nep Bot</div>
                            <div className={"intro"}>Invite the bot to your discord,and add Nep Bot as an adminstrator.</div>
                        </div>
                        <img className={"pic"} src={workInvite} alt="Invite Nep Bot"/>
                    </div>
                    <div className={"work-list"}>
                        <img className={"pic"} src={workRule} alt="Set up Rules"/>
                        <div className={"txt"}>
                            <div className={"title"}>Set up Rules</div>
                            <div className={"intro"}>Server owners set up rules to roles in he servers and create excluslve channels for the roles.</div>
                        </div>
                    </div>
                    <div className={"work-list"}>
                        <div className={"txt"}>
                            <div className={"title"}>Connect to Wallets</div>
                            <div className={"intro"}>After verification of their token threshold amount in Near wallets,users will get the corresponding roles and therefore access to the channels.</div>
                        </div>
                        <img className={"pic"} src={workConnect} alt="Connect to Wallets"/>
                    </div>

                    <div className={"partner"}>
                        <a className={"brand"} href="https://oct.network" target="view_window">
                            <img src={OCT} alt="OCT"/>
                        </a>
                        <a className={"brand"} href="https://near.org/" target="view_window">
                            <img src={near_large} alt="NEAR"/>
                        </a>
                        <a className={"brand"} href="https://qstn.us" target="view_window">
                            <img src={QSTN} alt="QSTN"/>
                        </a>
                        <a className={"brand"} href="https://fluxprotocol.org" target="view_window">
                            <img src={flux} alt="flux"/>
                        </a>
                        <a className={"brand"} href="https://www.fusotao.org/" target="view_window">
                            <img src={fusotao} alt="fusotao"/>
                        </a>
                    </div>
                </div>
                <div className={"power"}>
                    powered by 
                    <a href="https://near.org/" target="view_window">
                        <img src={near} alt="near"/>
                    </a>
                </div>

                <div className={"footer"}>
                    <div className={"media-list"}>
                        <a className={"media github"} href="https://github.com/NepBot" target="view_window"></a>
                        <a className={"media twitter"} href="https://twitter.com/nepbot4near" target="view_window"></a>
                        <a className={"media discord"} href="https://discord.gg/avqufmzS6t" target="view_window"></a>
                        <a className={"media youtube"} href="https://www.youtube.com/channel/UCXUE0Achwcvc_EYMkybXC4Q" target="view_window"></a>
                        <a className={"media medium"} href="https://nepbot.medium.com" target="view_window"></a>
                    </div>
                    <div className={"email"}>Email：hi@nepbot.org</div>
                </div>
            </div>
            {/* <div className={"cover-box"}>
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
            </div> */}
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
