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



function SetRule(props) {

    const guildData = qs.parse(props.location.search.slice(1));
    store.set('guild_id',guildData.guild_id , {expires:1})
    store.set('guild_name',guildData.guild_name , {expires:1})
    const [roleList, setRoleList] = useState([]);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [serverList, setServerList] = useState([]);
    const [tokenId, setTokenId] = useState('')
    const [dataSource, setDataSource] = useState(['']);
    const [tableStatus, setTableStatus] = useState(true);
    const [account, setAccount] = useState({})
    const columns = [
        {
            dataIndex: 'guild_name',
            title: 'Discord Server',
            key: 'guild_name',
            render:(text, record)=>(
                <span key={Math.random()}>{guildData.guild_name}</span>
            )
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
            dataIndex: 'token_id',
            title: 'Token Id',
            key: 'token_id',
        },
        {
            dataIndex: 'amount',
            title: 'Token Amount',
            key: 'amount',
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

    const handleData = async (data, servername) => {
        const roleList = await getRoleList();
        roleList.forEach(item => {
            data.forEach(async (it, index) => {
                if (item.id === it["role_id"] && item.name!=='@everyone' && item.name) {
                    it.role_name = item.name
                    it.guild_name = servername
                    it.key = index;
                    it.amount = formatAmount(it.amount)
                }

            })
        })
        console.log("roleList>>>",data)
        return data;
    }

    useEffect(() => {
        (async () => {

            
            const _near = await connect(config);
            const _wallet = new WalletConnection(_near, 'nepbot');
            if (!_wallet.isSignedIn()) {
                props.history.push(`/${props.location.search}&redirect=setrule`)
                return
            }
            const server = await getServer();
            setServerList(server);
            const account = await _wallet.account();
            setAccount(account)

            try{
                setTableStatus(true)
                const data = await account.viewFunction(config.contract_id, 'get_guild', {guild_id: server.id})
                const _data = await handleData(data, server.name)

                setTableStatus(false)
                setDataSource(_data)
            }catch (e) {
                setTableStatus(false)
            }

        })();
        return () => {
        }
    }, [addDialogStatus]);

    const handleAddStatus = useCallback(async () => {
        if (!addDialogStatus) {
            const roles = await getRoleList();
            setRoleList(roles.filter(item=>item.name!=="@everyone"))
        }
        setAddDialogStatus(!addDialogStatus)
    }, [addDialogStatus]);

    const handleDelete = async (record) =>{
        console.log(record.role_id)
        const obj = {role_id:record.role_id,signType:'del'}
        const msg = {
            args: obj,
            sign: await sign(account.accountId, obj),
            account_id: account.accountId
        }
        const _sign = await signRule(msg);
        console.log(_sign)
        console.log({args:record.role_id,..._sign})
        try {
            setTableStatus(true);
           const delRule = await account.functionCall(
                config.contract_id,
                'del_role',
                {args:JSON.stringify(record.role_id),..._sign},
                '300000000000000'
            );
           setTimeout(async ()=>{
               if(delRule){
                   setTableStatus(false);
                   await handleReload()
               }
           })
        }catch (e) {
            console.error(e)
        }
    }
    const handleSearch = useCallback(async () => {
        if (!tokenId) {
            await handleReload();
        } else {
            const account = await contract();
            const data = await account.viewFunction(config.contract_id, 'get_token', {token_id: tokenId})
            const _data = await handleData(data, serverList.name);
            console.log(_data)
            setDataSource(_data);
        }
        // eslint-disable-next-line
    }, [serverList.name, tokenId])

    const handleReload = async () => {
        setTableStatus(true)
        const account = await contract();
        const data = await account.viewFunction(config.contract_id, 'get_guild', {guild_id: serverList.id})
        const _data = await handleData(data, serverList.name)
        setDataSource(_data);
        setTableStatus(false)
    }
    return (
        <div className={'setRule_content'}>
            <div className={'search_bar'}>

                <Row gutter={24}>
                    <Col>
                        <Button type={"primary"} onClick={handleAddStatus}>add</Button>
                    </Col>
                    <Col><Input placeholder={'Enter a token ID to search'} value={tokenId} onInput={(e) => {
                        setTokenId(e.target.value)
                    }}/></Col>
                    <Col>
                        <Button onClick={handleSearch}>Search</Button>
                    </Col>
                </Row>
            </div>
            <Table loading={tableStatus} columns={columns} dataSource={dataSource} rowKey={(record)=>`rest${record.key*Math.random()}`}/>

            <AddRule title="Basic Modal" roleList={roleList} serverList={serverList} visible={addDialogStatus}
                     onOk={handleAddStatus} onCancel={handleAddStatus}/>
        </div>
    );
}

export default SetRule;
