import React, {useCallback, useEffect, useState} from 'react';
import {Button, Input, Table, Row, Col,Space} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {config} from "../../config";
import AddRule from "./addRule";
import {getRoleList, getServer, signRule} from "../../api/api";
import './setRule.css'
import qs from "qs";
import store from "../../store/discordInfo";
import {contract, formatAmount, sign} from "../../utils/util";
import test_icon from '../../assets/imgs/test_icon.png';
import no_data from '../../assets/imgs/no_data.jpg';


function SetRule(props) {
    let account = {}
    const guildData = qs.parse(props.location.search.slice(1));
    store.set('guild_id',guildData.guild_id , {expires:1})
    const [roleList, setRoleList] = useState([]);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [serverList, setServerList] = useState([]);
    const [tokenId, setTokenId] = useState('')
    const [dataSource, setDataSource] = useState([]);
    const [appchainIds, setAppchainIds] = useState([])
    const columns = [
        {
            dataIndex: 'guild_name',
            title: 'Discord Server',
            key: 'guild_name',
            render:(text, record)=> {
                return (
                    <span key={Math.random()}>{guildData.guild_name}</span>
                )
            }
            
        },
        {
            dataIndex: 'role_name',
            title: 'Role',
            key: 'role_name',
            render: (text,record) => {
                return (
                    <p key={record.role_id}>{record.role_name ?? (<span style={{color:"#f40"}}>Deleted</span>)}</p>
                )
            }
        },
        {
            dataIndex: 'key_field',
            title: 'Key value',
            key: 'key_field',
            render: (text,record) => {
                if (record.key_field) {
                    return (
                        <p key={record.key_field[1]}>{`${record.key_field[0]}: ${record.key_field[1]}`}</p>
                    )
                }
                else {
                    return (<div/>)
                }
            }
        },
        {
            dataIndex: 'fields',
            title: 'Attribute',
            key: 'fields',
            render: (text,record) => {
                if (record.key_field) {
                    if (record.key_field[0] == 'token_id') {
                        return (
                            <p key={Math.random()}>{`token amount: ${formatAmount(record.fields.token_amount, record.decimals)}`}</p>
                        )
                    } else if (record.key_field[0] == 'appchain_id') {
                        return (
                            <p key={Math.random()}>{`oct role: ${record.fields.oct_role}`}</p>
                        )
                    } else if (record.key_field[0] == 'near') {
                        return (
                            <p key={Math.random()}>{`near balance: ${formatAmount(record.fields.balance)}`}</p>
                        )
                    }
                }
                else {
                    return (<div/>)
                }
                
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <span onClick={()=>{handleDelete(record)}} style={{color:'#f40', cursor: 'pointer'}}>Delete</span>
                </Space>
            ),
        },
    ]

    const handleData = async (data) => {
        const roleList = await getRoleList(store.get("guild_id"));
        let serverName = serverList.name
        data.forEach(async (it, index) => {
            roleList.forEach(item => {
                if (item.id === it["role_id"]) {
                    it.role_name = item.name
                    it.guild_name = serverName
                    it.key = index;
                }
            })
        })
        console.log(data)
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
            } else if (it.key_field[0] === 'x.paras.near') {

            }
        }
        console.log("roleList>>>",data)
        return data;
    }

    useEffect(() => {
        (async () => {

            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return
            }
            const server = await getServer(store.get("guild_id"));
            setServerList(server);
            account = await wallet.account();
            const appchainIds = await account.viewFunction(config.OCT_CONTRACT, 'get_appchain_ids', {})
            setAppchainIds(appchainIds)

            const data = await account.viewFunction(config.RULE_CONTRACT, 'get_guild', {guild_id: server.id})
            const _data = await handleData(data)
            setDataSource(_data)


        })();
        return () => {
        }
    }, [addDialogStatus]);

    const handleAddStatus = useCallback(async () => {
        if (!addDialogStatus) {
            const roles = await getRoleList(store.get("guild_id"));
            setRoleList(roles.filter(item=>item.name!=="@everyone"))
        }
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
        const msg = {
            args: [obj],
            sign: await sign(account, [obj]),
            account_id: account.accountId
        }
        console.log(msg)
        const _sign = await signRule(msg);
        console.log(_sign)

        const delRule = await account.functionCall(
            config.RULE_CONTRACT,
            'del_role',
            {args:JSON.stringify([obj]),..._sign},
            '300000000000000'
        );
        setTimeout(async ()=>{
            if(delRule){
                await handleReload()
            }
        })
    }
    const handleSearch = useCallback(async () => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'nepbot');
        account = await wallet.account();
        if (!tokenId) {
            await handleReload();
        } else {
            // const account = await contract();
            const data = await account.viewFunction(config.RULE_CONTRACT, 'get_token', {token_id: tokenId})
            const _data = await handleData(data);
            console.log(_data)
            setDataSource(_data);
        }
        // eslint-disable-next-line
    }, [serverList.name, tokenId])

    const handleReload = async () => {
        const near = await connect(config);
        const wallet = new WalletConnection(near, 'nepbot');
        account = await wallet.account();
        const data = await account.viewFunction(config.RULE_CONTRACT, 'get_guild', {guild_id: serverList.id})
        const _data = await handleData(data)
        setDataSource(_data);
    }


    function SetRuleList(){
        if(dataSource.length>0){
            const setRuleItems = dataSource.map(item => 
                <div className={'setRule-item'} key={Math.random()}>
                    <div className={'guild-name'}>#{item.guild_name}</div>
                    <div className={'role_name'}>{item.role_name}</div>
                    <FileList item={item}/>
                    <img className={'token-icon'} src={item.icon}/>
                    <div className={'delete-btn'} onClick={()=>{handleDelete(item)}}>delete</div>
                </div>
            );
            
            return (<div className={'setRule-list'}>
                {setRuleItems}
            </div>)
        }else{
            return (<div className={'no-data'}>
                <img src={no_data}/>
                <div className={'tip'}>No data, Please add a rule.</div>
                <div className={'btn'} onClick={handleAddStatus}>+ Add</div>
            </div>)
        }
    }


    function FileList(props){
        if(props.item.key_field){
            if (props.item.key_field[0] == "token_id") {
                return (<div className={'file-list'}>
                    <div>{`token: ${props.item.token_symbol}`}</div>
                    <div>{`amount: ${formatAmount(props.item.fields.token_amount, props.item.decimals)}`}</div>
                </div>)
            } else if (props.item.key_field[0] == "appchain_id") {
                return (<div className={'file-list'}>
                    <div>{`appchain: ${props.item.key_field[1]}`}</div>
                    <div>{`role: ${props.item.fields.oct_role}`}</div>
                </div>)
            } else if (props.item.key_field[0] == "near") {
                return (<div className={'file-list'}>
                    <div>{`near balance: ${formatAmount(props.item.fields.balance)}`}</div>
                </div>)
            } else if (props.item.key_field[0] == "nft_contract_id") {
                return (<div className={'file-list'}>
                    <div>{`NFT: ${props.item.name}`}</div>
                    <div>{`amount: ${props.item.fields.token_amount}`}</div>
                </div>)
            }
            
        }else{
            return (<div></div>);
        }
        
    }


    return (
        <div className={'setRule-box'}>
            <div className={'nav-bar'}>
                <div className={'add-btn'} onClick={handleAddStatus}>+ Add</div>
            </div>
            <div className={'setRule-content'}>
                <SetRuleList/>
                {/* <Table loading={tableStatus} columns={columns} dataSource={dataSource} rowKey={(record)=>`rest${record.key*Math.random()}`}/> */}
                <AddRule title="Basic Modal" appchainIds={appchainIds} roleList={roleList} serverList={serverList} visible={addDialogStatus}
                        onOk={handleAddStatus} onCancel={handleAddStatus}/>
            </div>
        </div>
    );
}

export default SetRule;
