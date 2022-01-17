/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Button, List} from 'antd';
import {connect, WalletConnection} from 'near-api-js';
import qs from 'qs';
import {config} from '../../config';
import './Index.css';
import store from "../../store/discordInfo";

const signIn = (wallet,nickName) => {
  wallet.requestSignIn(
    nickName, // contract requesting access
    "discord Bot", // optional
    `${window.location.origin}/success`, // optional
    `${window.location.origin}/failure` // optional
  );
};
export default function Index(props) {
    const [nickName, setNickName] = useState('');
    const [near,setNear] = useState({})
    const [wallet,setWallet] = useState({})
    const [balance,setBalance] = useState({total:0})

    const handleConnect = useCallback(async () => {
        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,nickName);
        setNear(_near);
        setWallet(_wallet)
        signIn(_wallet,nickName);
    }, [near,wallet])
    const handleNickName = useCallback((e) => {
        console.log(e)
        setNickName(e.target.value)
    }, []);

    const handleGetInfo = useCallback(async () => {
        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,null);
        const account = await _wallet.account();
        const _balance = await account.getAccountBalance();
        const detail = await account.getAccountDetails();
        console.log("detail>>>>",detail)
        setBalance(_balance)
        console.log(_balance)
        console.log(store)
        // storage.set("name", { name: "SuperIron" }, { expires: 1 });
    }, [nickName,balance]);

    useEffect(()=>{
        const search =  qs.parse(props.location.search.slice(1));
        setNickName(search?.near_wallet || '')
        store.set('user_id',search?.user_id , {expires:1})
        store.set('guild_id',search?.guild_id , {expires:1})
    },[])

    return (
        <div className={"wrap"}>
            <div className={'content'}>
                <h1 className={'title'}>Connect near wallet</h1>
                {/*<Input size="large" className={'nickName'} value={nickName}  onInput={handleNickName}*/}
                {/*       placeholder="Please enter your wallet nickname"/>*/}
                <Row justify={'space-around'}>
                    <Col span='12'>
                        <Button type={'primary'} shape="round" danger size={'large'}
                                onClick={handleConnect}>connect near wallet</Button>
                    </Col>
                    {/*<Col span='12'>*/}
                    {/*    <Button type={'primary'} shape="round" size={'large'} onClick={handleGetInfo}>Get Info</Button>*/}
                    {/*</Col>*/}
                    {/*<List.Item>*/}
                    {/*    <span>Balance:</span>{balance.total / 10 **24}*/}
                    {/*</List.Item>*/}
                </Row>
            </div>
        </div>
    )
}
