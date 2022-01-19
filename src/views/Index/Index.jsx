/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Button, List} from 'antd';
import {connect, WalletConnection} from 'near-api-js';
import qs from 'qs';
import {config} from '../../config';
import './Index.css';
import store from "../../store/discordInfo";


export default function Index(props) {
    const [near,setNear] = useState({})
    const [wallet,setWallet] = useState({})
    const [redirect, setRedirect] = useState('success')

    const signIn = (wallet) => {
        wallet.requestSignIn(
          config.contract_id, // contract requesting access
          "nepbot", // optional
          `${window.location.origin}/${'setrule'}${props.location.search}`, // optional
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
        console.log(search.redirect?search.redirect:'success')
        setRedirect(search.redirect?search.redirect:'success')
    },[redirect])

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
