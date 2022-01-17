import React, {useCallback, useEffect, useState} from 'react';
import {Button, Input, Table, Row, Col, Space} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {config} from "../../config";
import AddRule from "./addRule";
import qs from 'qs'
import {delRule, getRoleList, getRuleList} from "../../api/api";
import './setRule.css'
import store from "../../store/discordInfo";


const handleData = async (data, servername) => {
    const roleList = await getRoleList();
    roleList.forEach(item => {
        data.forEach((it, index) => {
            if (item.id === it["role_id"]) {
                it.role_name = item.name
                it.guild_name = servername
                it.key = index
            }
        })
    })
    return data;
}
// eslint-disable-next-line no-unused-vars
const account = async () => {
    const _near = await connect(config);
    const wallet = new WalletConnection(_near, null);
    return wallet.account(config);
}

function SetRuleS(props) {
    const [roleList, setRoleList] = useState([]);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [serverList, setServerList] = useState([]);
    const [tokenId, setTokenId] = useState('')
    const [dataSource, setDataSource] = useState(['']);
    const [tableStatus, setTableStatus] = useState(true);
    const [ruleModelTile,setRuleModelTile] = useState('');
    const [ruleEditData,setRuleEditData] = useState({})
    const columns = [
        {
            dataIndex: 'guild_name',
            title: '',
            key: 'guild_name',
        },
        {
            dataIndex: 'role_name',
            title: '',
            key: 'role_name',
        },
        {
            dataIndex: 'token_id',
            title: 'Token Id',
            key: 'token_id',
        },
        {
            dataIndex: 'amount',
            title: 'Token Amount',
            key: 'amount'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (

                <>
                    <Space size="middle">
                        <span onClick={() => {
                            handleDelete(record)
                        }} style={{color: '#f40', cursor: 'pointer'}}></span>
                    </Space>

                    <Space size="middle" style={{marginLeft:5}}>
                        <span onClick={() => {
                            handleEdit(record)
                        }} style={{color: '#00a4ff', cursor: 'pointer'}}></span>
                    </Space>
                </>
            ),
        },
    ];

    const guildData = qs.parse(props.location.search.slice(1));
    store.set('guild_id',guildData.guild_id , {expires:1})
    store.set('guild_name',guildData.guild_name , {expires:1})
    useEffect(() => {
        (async () => {
            console.log(guildData)
            try {
                setTableStatus(true)
                const rules = await getRuleList();
                const _data = await handleData(rules, guildData.guild_name)

                setTableStatus(false)
                setDataSource(_data)
            } catch (e) {
                setTableStatus(false)
            }
            setServerList({id:guildData.guild_id,name:guildData.guild_name});
        })();
        return () => {
        }
    }, [addDialogStatus]);

    const handleAddStatus = useCallback(async () => {
        if (!addDialogStatus) {

            const roles = await getRoleList();
            setRoleList(roles)
        }
        setRuleEditData({})
        setAddDialogStatus(!addDialogStatus)
        setRuleModelTile('');
    }, [addDialogStatus]);

    const handleDelete = async (record) => {
        console.log(record)
        try {
            const delRes = await delRule(record.id);
            await handleReload();
        } catch (e) {
        }
    }
    const handleEdit = async (record) => {
        console.log(record)
        try {
            const roles = await getRoleList();
            setRoleList(roles)
            setRuleModelTile('');
            setAddDialogStatus(true);
            setRuleEditData(record)
        } catch (e) {
        }
    }
    const handleSearch = useCallback(async () => {
        if (!tokenId) {
            await handleReload();
        } else {
            const data = await getRuleList({token_id: tokenId.trim()})
            const _data = await handleData(data, serverList.name);
            console.log(_data)
            setDataSource(_data);
        }
    }, [serverList.name, tokenId])

    const handleReload = async () => {
        setTableStatus(true)
        const rules = await getRuleList();
        const _data = await handleData(rules, serverList.name)

        setDataSource(_data);
        setTableStatus(false)
    }
    return (
        <div className={'setRule_content'}>
            <div className={'search_bar'}>

                <Row gutter={24}>
                    <Col>
                        <Button type={"primary"} onClick={handleAddStatus}></Button>
                    </Col>
                    <Col><Input placeholder={'tokenId'} value={tokenId} onInput={(e) => {
                        setTokenId(e.target.value)
                    }}/></Col>
                    <Col>
                        <Button onClick={handleSearch}></Button>
                    </Col>
                </Row>
            </div>
            <Table loading={tableStatus} columns={columns} dataSource={dataSource}/>

            <AddRule editData={ruleEditData} title={ruleModelTile} roleList={roleList} serverList={serverList} visible={addDialogStatus}
                     onOk={handleAddStatus} onCancel={()=>{
                         setAddDialogStatus(false)
            }}/>
        </div>
    );
}

export default SetRuleS;
