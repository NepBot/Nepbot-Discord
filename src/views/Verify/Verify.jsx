/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Button, List} from 'antd';
import {connect, WalletConnection, keyStores, KeyPair} from 'near-api-js';
// import * as nearAPI from "near-api-js";
// import runHereWallet from "@here-wallet/connect" 
// import "@here-wallet/connect/index.css"
import qs from 'qs';
import {getConfig} from '../../config';
import {sign} from "../../utils/util";
import './Verify.css';
import store from "../../store/discordInfo";
import { setInfo, getServer, getUser, getConnectedAccount, disconnectAccount } from '../../api/api';
import { useHistory } from 'react-router-dom';
import icon_connected from '../../assets/images/icon-connected.png';
import WalletSelector from '../../utils/walletSelector';

const config = getConfig()

export default function Index(props) {
    const [serverName,setServerName] = useState('')
    const [displayName,setDisplayName] = useState('')
    const [accountId, setAccountId] = useState('')
    const [localAccount,setLocalAccount] = useState('');
    const [avatarURL,setAvatarURL] = useState('')
    const [walletSelector, setWalletSelector] = useState({})
    const [wallet, setWallet] = useState({})
    const history = useHistory()


    // const signIn = async (_wallet, type) => {
    //     if (type == "near") {
    //         _wallet.requestSignIn(
    //             config.RULE_CONTRACT, // contract requesting access
    //             "nepbot", // optional
    //             `${window.location.origin}/wait`, // optional
    //         );
    //     } else if (type == "sender") {
    //         if (typeof window.near == 'undefined' || !window.near.isSender) {
    //             window.open("https://senderwallet.io/")
    //             return
    //         }
    //         const res = await window.near.requestSignIn({
    //             contractId: config.RULE_CONTRACT, 
    //         })
    //         if (res && res.accessKey) {
    //             window.localStorage.setItem(`near-api-js:keystore:pending_key${res.accessKey.publicKey}:${config.networkId}`, res.accessKey.secretKey)
    //             window.localStorage.setItem("isSender", true)
    //             history.push({pathname: `/wait`, search: `account_id=${window.near.accountId}&public_key=${encodeURIComponent(res.accessKey.publicKey)}&all_keys=${encodeURIComponent(res.accessKey.publicKey)}`})
    //         }
    //     }  
    //     // else if (type == "here") {
    //     //     runHereWallet({ near:nearAPI })
    //     //     _wallet.requestSignIn(
    //     //         config.RULE_CONTRACT, // contract requesting access
    //     //         "nepbot", // optional
    //     //         `${window.location.origin}/wait`, // optional
    //     //     );
    //     // }  
    // };

    const handleConnect = useCallback(async () => {
        walletSelector.modal.show()
    }, [walletSelector])

    const otherWallet = useCallback(async () => {
        await handleDisconnect();
        await handleConnect();
    }, [wallet, localAccount])

    const handleDisconnect = useCallback(async () => {
        if(localAccount){
            await wallet.signOut()
        }
        const search =  qs.parse(props.location.search.slice(1));
        const res = await disconnectAccount({
            guild_id: search.guild_id,
            user_id: search.user_id,
            sign: search.sign
        });
        setAccountId()
        setLocalAccount()
    }, [wallet, localAccount])

    const connectWallet = useCallback(async () => {
        history.push({pathname: `/wait`})
    })

    useEffect(async ()=>{
        const walletSelector = await WalletSelector.new({
            successUrl: `${window.location.origin}/wait`,
        })
        setWalletSelector(walletSelector)
        let localAccountId
        if (walletSelector.selector.isSignedIn()) {
            const wallet = await walletSelector.selector.wallet()
            setWallet(wallet)
            localAccountId = (await wallet.getAccounts())[0].accountId;
            setLocalAccount(localAccountId);
        }
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
        if(accountId){
            return <div className={'verify-info'}>
                <div className={'avatar-box'}>
                    <img className={'avatar'} src={avatarURL} alt={displayName} hidden={avatarURL == ''}/>
                    <img className={'icon-connected'} src={icon_connected} alt=""/>
                </div>
                <div className={'name'}>{displayName}</div>
                <div className={'account-name'}>{accountId}</div>
                <div className={'server-name'}>{serverName}</div>
                <div className={'disconnect-btn'} onClick={handleDisconnect}>Disconnect</div>
            </div>
        }else{
            if(localAccount){
                return <div className={'verify-info'}>
                    <img className={'avatar'} src={avatarURL} alt={displayName} hidden={avatarURL == ''}/>
                    <div className={'name'}>{displayName}</div>
                    <div className={'server-name'}>{serverName}</div>
                    <div className={'connect-btn-box'}><div className={'connect-btn'} onClick={() => {connectWallet()}}>{localAccount}</div></div>
                    <div className={'disconnect-btn other-btn'} onClick={otherWallet}>Other Wallets</div>
                    <div className={'tip'}>Verify with your wallet</div>
                </div>
            }else{
                return <div className={'verify-info'}>
                    <img className={'avatar'} src={avatarURL} alt={displayName} hidden={avatarURL == ''}/>
                    <div className={'name'}>{displayName}</div>
                    <div className={'server-name'}>{serverName}</div>
                    <div className={'connect-btn-box'}><div className={'connect-btn'} onClick={() => {handleConnect()}}>Connect Wallet</div></div>
                    <div className={'tip'}>Verify with your wallet</div>
                </div>
            }
        } 
        
    }

    return (
        <div className={"verify-box"}>
      
                <Login></Login>
            
        </div>
    )
}
