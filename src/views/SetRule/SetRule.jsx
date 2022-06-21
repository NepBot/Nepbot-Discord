import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Button, Input, Table, Row, Col,Space,message} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import AddRule from "./addRule";
import {getRoleList, getServer, signRule, getOperationSign} from "../../api/api";
import './setRule.css'
import qs from "qs";
import store from "../../store/discordInfo";
import {formatAmount, sign} from "../../utils/util";
import test_icon from '../../assets/imgs/test_icon.png';


import logo from '../../assets/images/index/logo.png';
import add from '../../assets/images/setRule/add.png';
import success from '../../assets/images/success.png';
import no_data from '../../assets/images/no-data.png';

const config = getConfig()

function SetRule(props) {
    let account = {}
    const [roleList, setRoleList] = useState([]);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [server, setServer] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [appchainIds, setAppchainIds] = useState([])
    const [operationSign, setOperationSign] = useState("")
    const history = useHistory()

    const handleData = async (data,server_name='') => {
        const roleList = await getRoleList(store.get("info").guild_id);
        let serverName = server.name || server_name
        data.forEach(async (it, index) => {
            roleList.forEach(item => {
                if (item.id === it["role_id"]) {
                    it.role_name = item.name
                    it.guild_name = serverName
                    it.key = index;
                }
            })
        })
        roleList.forEach(item => {
            data.forEach((it, index) => {
                if (item.id === it["role_id"] && item.name!=='@everyone' && item.name) {
                    it.role_name = item.name
                    it.guild_name = serverName
                    it.key = index;
                    
                }
                
            })
        })
        for (let it of data) {
            if (it.key_field[0] === 'token_id') {
                let metadata = await account.viewFunction(it.key_field[1], "ft_metadata", {})
                it.token_symbol = metadata.symbol
                it.icon = metadata.icon
                it.decimals = metadata.decimals
            } else if (it.key_field[0] === 'appchain_id') {
                it.icon = test_icon
            } else if (it.key_field[0] === 'near') {
                it.icon = "https://near.org/wp-content/themes/near-19/assets/img/brand-icon.png"
            } else if (it.key_field[0] === 'nft_contract_id') {
                let metadata = await account.viewFunction(it.key_field[1], "nft_metadata", {})
                it.icon = metadata.icon
                it.name = metadata.name
            } else if (it.key_field[0] === config.PARAS_CONTRACT) {
                it.icon = "data:image/png;base64,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"
                it.name = it.key_field[1]
            }
        }
        console.log("roleList>>>",data)
        return data;
    }

    useEffect(() => {
        (async () => {
            const search =  qs.parse(props.location.search.slice(1));
            store.set("info", {
                guild_id: search.guild_id,
                user_id: search.user_id,
                sign: search.sign
            }, { expires: 1 });

            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            try {
                await wallet._completeSignInWithAccessKey()
            } catch {}

            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return
            }
            const accountId = wallet.getAccountId()
            let operationSign = store.get("operationSign")
            const args = {
                account_id: accountId, 
                user_id: search.user_id,
                guild_id: search.guild_id,
                sign: search.sign,
                operationSign: operationSign
            }
            const signature = await sign(wallet.account(), args)
            operationSign = await getOperationSign({
                args: args,
                account_id: accountId,
                sign: signature 
            })
            if (!operationSign) {
                history.push({pathname: '/linkexpired', })
                return
            }
            setOperationSign(operationSign)
            store.set("operationSign", operationSign, { expires: 1 })
            const server = await getServer(search.guild_id);
            setServer(server);
            account = await wallet.account();
            const appchainIds = await account.viewFunction(config.OCT_CONTRACT, 'get_appchain_ids', {})
            setAppchainIds(appchainIds)

            const data = await account.viewFunction(config.RULE_CONTRACT, 'get_guild', {guild_id: search.guild_id})
            const guildData = await handleData(data,server.name)
            setDataSource(guildData)
        })();
        return () => {
        }
    }, [addDialogStatus]);

    const handleAddStatus = useCallback(async () => {
        if (!addDialogStatus) {
            const roles = await getRoleList(store.get("info").guild_id);
            setRoleList(roles.filter(item=>item.name!=="@everyone"))
        }else{
            message.info('Success');
        }
        setAddDialogStatus(!addDialogStatus)
    }, [addDialogStatus]);

    const handleCancelStatus = useCallback(async () => {
        setAddDialogStatus(!addDialogStatus)
    }, [addDialogStatus]);

    const handleDelete = async (record) =>{
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'nepbot');
        account = await wallet.account();
        const obj = {
            guild_id: record.guild_id,
            role_id: record.role_id,
            key_field: record.key_field,
            fields: record.fields
        }
        const params = store.get("info")
        const args = {
            sign: operationSign,
            user_id: params.user_id,
            guild_id: params.guild_id,
        }
        const msg = {
            args: args,
            sign: await sign(account, args),
            account_id: account.accountId
        }
        const _sign = await signRule(msg);
        if (!_sign) {
            history.push({pathname: '/linkexpired', })
            return
        }
        const delRule = await account.functionCall(
            config.RULE_CONTRACT,
            'del_roles',
            {roles:[obj], ..._sign},
            '300000000000000'
        );
        setTimeout(async ()=>{
            if(delRule){
                await handleReload()
                message.info('Success');
            }
        })
    }
    // const handleSearch = useCallback(async () => {
    //     const near = await connect(config);
    //     const wallet = new WalletConnection(near, 'nepbot');
    //     account = await wallet.account();
    //     if (!tokenId) {
    //         await handleReload();
    //     } else {
    //         // const account = await contract();
    //         const data = await account.viewFunction(config.RULE_CONTRACT, 'get_token', {token_id: tokenId})
    //         const _data = await handleData(data);
    //         console.log(_data)
    //         setDataSource(_data);
    //     }
    //     // eslint-disable-next-line
    // }, [server.name, tokenId])

    const handleReload = async () => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'nepbot');
        account = await wallet.account();
        const data = await account.viewFunction(config.RULE_CONTRACT, 'get_guild', {guild_id: store.get("info").guild_id})
        const _data = await handleData(data)
        setDataSource(_data);
    }


    function SetRuleList(){
        if(dataSource.length>0){
            const setRuleItems = dataSource.map((item,index) => 
                <div className={['setRule-item', (index%3===2) ? 'mr0' : ''].join(' ')} key={Math.random()}>
                    <div className={'token-info'}>
                        <img className={'token-icon'} src={item.icon} alt={"token"}/>
                        <div className={'token-symbol'}>{item.token_symbol}</div>
                        <div className={'delete-btn'} onClick={()=>{handleDelete(item)}}></div>
                    </div>
                    <div className={'file-item'}>
                        <div className={'name'}>guild name:</div>
                        <div className={'info'}>{item.guild_name}</div>
                    </div>
                    <div className={'file-item'}>
                        <div className={'name'}>role name:</div>
                        <div className={'info'}>{item.role_name}</div>
                    </div>
                    <FileList item={item}/>
                </div>
            );
            
            return (<div className={'setRule-list'}>
                {setRuleItems}
            </div>)
        }
        else{
            return (<div className={'no-data'}>
                <img src={no_data}/>
                <div className={'tip'}>No data, please add a new rule.</div>
            </div>)
        }
    }


    function FileList(props){
        if(props.item.key_field){
            if (props.item.key_field[0] == "token_id") {
                return (<div className={'file-list'}>
                    <div className={'file-item'}>
                        <div className={'name'}>token:</div>
                        <div className={'info'}>{props.item.token_symbol}</div>
                    </div>
                    <div className={'file-item'}>
                        <div className={'name'}>amount:</div>
                        <div className={'info'}>{formatAmount(props.item.fields.token_amount, props.item.decimals)}</div>
                    </div>
                    {/* <div>{`token: ${props.item.token_symbol}`}</div>
                    <div>{`amount: ${formatAmount(props.item.fields.token_amount, props.item.decimals)}`}</div> */}
                </div>)
            } else if (props.item.key_field[0] == "appchain_id") {
                return (<div className={'file-list'}>
                    <div className={'file-item'}>
                        <div className={'name'}>appchain:</div>
                        <div className={'info'}>{props.item.key_field[1]}</div>
                    </div>
                    <div className={'file-item'}>
                        <div className={'name'}>role:</div>
                        <div className={'info'}>{props.item.fields.oct_role}</div>
                    </div>
                    {/* <div>{`appchain: ${props.item.key_field[1]}`}</div>
                    <div>{`role: ${props.item.fields.oct_role}`}</div> */}
                </div>)
            } else if (props.item.key_field[0] == "near") {
                return (<div className={'file-list'}>
                    <div className={'file-item'}>
                        <div className={'name'}>near balance:</div>
                        <div className={'info'}>{formatAmount(props.item.fields.balance)}</div>
                    </div>
                    {/* <div>{`near balance: ${formatAmount(props.item.fields.balance)}`}</div> */}
                </div>)
            } else if (props.item.key_field[0] == "nft_contract_id") {
                return (<div className={'file-list'}>
                    <div className={'file-item'}>
                        <div className={'name'}>NFT:</div>
                        <div className={'info'}>{props.item.name}</div>
                    </div>
                    <div className={'file-item'}>
                        <div className={'name'}>amount:</div>
                        <div className={'info'}>{props.item.fields.token_amount}</div>
                    </div>
                    {/* <div>{`NFT: ${props.item.name}`}</div>
                    <div>{`amount: ${props.item.fields.token_amount}`}</div> */}
                </div>)
            } else if (props.item.key_field[0] == config.PARAS_CONTRACT) {
                return (<div className={'file-list'}>
                    <div className={'file-item'}>
                        <div className={'name'}>NFT:</div>
                        <div className={'info'}>{props.item.name}</div>
                    </div>
                    <div className={'file-item'}>
                        <div className={'name'}>amount:</div>
                        <div className={'info'}>{props.item.fields.token_amount}</div>
                    </div>
                    {/* <div>{`NFT: ${props.item.name}`}</div>
                    <div>{`amount: ${props.item.fields.token_amount}`}</div> */}
                </div>)
            }
            
        }else{
            return (<div></div>);
        }
        
    }


    return (
        <div className={'page-box'}>
            <div className={'page-bg'}></div>
            <div className={'page-header'}>
                <img className={"logo"} src={logo}/>
                {/* <Input className={'search-input'} bordered={false} placeholder="Enter a token ID to search" /> */}
                <div className={'add-btn'} onClick={handleAddStatus}>
                    <img className={"add-icon"} src={add}/>
                    Add
                </div>
            </div>
            <SetRuleList/>
            {/* <Table loading={tableStatus} columns={columns} dataSource={dataSource} rowKey={(record)=>`rest${record.key*Math.random()}`}/> */}
            <AddRule title="Basic Modal" appchainIds={appchainIds} roleList={roleList} server={server} visible={addDialogStatus}  onOk={handleAddStatus} onCancel={handleCancelStatus}/>
        </div>
    );
}

export default SetRule;
