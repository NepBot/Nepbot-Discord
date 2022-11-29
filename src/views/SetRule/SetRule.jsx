import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Button, Input, Table, Row, Col,Space,message} from "antd";
import {connect, WalletConnection, keyStores} from "near-api-js";
import {getConfig} from "../../config";
import AddRule from "./addRule";
import {getRoleList, getServer,getTransactionList, signRule, getOperationSign} from "../../api/api";
import './setRule.scss'
import qs from "qs";
import store from "../../store/discordInfo";
import {formatAmount, sign} from "../../utils/util";
import { requestTransaction } from '../../utils/contract';
import test_icon from '../../assets/imgs/test_icon.png';
import astro_icon from '../../assets/images/setRule/astro-icon.svg';
import WalletSelector from '../../utils/walletSelector';


import logo from '../../assets/images/index/logo.png';
import add from '../../assets/images/setRule/add.png';
import jump from '../../assets/images/setRule/icon-jump.png';
import no_data from '../../assets/images/no-data.png';
import paras_logo from '../../assets/images/paras.json';

const config = getConfig()

function SetRule(props) {
    let account = {}
    let accountId = ''
    let privateKey = ''
    const [roleList, setRoleList] = useState([]);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [server, setServer] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [appchainIds, setAppchainIds] = useState([])
    const [operationSign, setOperationSign] = useState("")
    const history = useHistory()

    const handleData = async (data,server_name='') => {
        const roleList = await getRoleList(store.get("info").guild_id);
        const txList = await getTransactionList(store.get("info").guild_id);
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
                it.icon = paras_logo
                it.name = it.key_field[1]
            } else if (it.key_field[0] === 'astrodao_id') { 
                it.icon = astro_icon
            } else if (it.key_field[0] === 'gating_rule') { 
                it.icon = paras_logo
            }
            
            for(let tx of txList){
                if(isObjectValueEqual(it.fields , tx['roles'][0]['fields']) && it.key_field.join('') === tx['roles'][0]['key_field'].join('') && it.role_id === tx['roles'][0]['role_id']){
                    it.transaction_hash = tx.transaction_hash;
                }
            }

        }
        console.log("roleList>>>",data)
        console.log("txList>>>",txList)
        return data;
    }

    function isObjectValueEqual(a, b) {
        if (a === b) return true
        let aProps = Object.getOwnPropertyNames(a)
        let bProps = Object.getOwnPropertyNames(b)
        if (aProps.length !== bProps.length) return false
        for (let prop in a) {
            if (b.hasOwnProperty(prop)) {
                if (typeof a[prop] === 'object') {
                    if (!isObjectValueEqual(a[prop], b[prop])) return false
                } else if (a[prop] !== b[prop]) {
                    return false
                }
            } else {
                return false
            }
        }
        return true
    }

    useEffect(() => {
        (async () => {
            const search =  qs.parse(props.location.search.slice(1));
            store.set("info", {
                guild_id: search.guild_id,
                user_id: search.user_id,
                sign: search.sign
            }, { expires: 1 });

            const walletSelector = await WalletSelector.new({})
            if (!walletSelector.selector.isSignedIn()) {
                const selector = document.getElementById("near-wallet-selector-modal");
                walletSelector.modal.show();
                selector.getElementsByClassName('nws-modal-overlay')[0].style.display= 'none';
                selector.getElementsByClassName('close-button')[0].style.display= 'none';
                return
            }
            const wallet = await walletSelector.selector.wallet()
            accountId = (await wallet.getAccounts())[0].accountId
            privateKey = await walletSelector.getPrivateKey(accountId)
            const keyStore = new keyStores.InMemoryKeyStore();
            const near = await connect({
                keyStore,
                ...config,
            });
            account = await near.account();

            let operationSign = store.get("operationSign")
            const args = {
                account_id: accountId, 
                user_id: search.user_id,
                guild_id: search.guild_id,
                sign: search.sign,
                operationSign: operationSign
            }
            
            const signature = await sign(privateKey, args)
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
            // account = await wallet.account();
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

        const walletSelector = await WalletSelector.new({})
        const wallet = await walletSelector.selector.wallet()
        accountId = (await wallet.getAccounts())[0].accountId
        privateKey = await walletSelector.getPrivateKey(accountId)
        const keyStore = new keyStores.InMemoryKeyStore();
        const near = await connect({
            keyStore,
            ...config,
        });
        const account = await near.account();


        const msg = {
            args: args,
            sign: await sign(privateKey, args),
            account_id: accountId
        }
        const _sign = await signRule(msg);
        if (!_sign) {
            history.push({pathname: '/linkexpired', })
            return
        }
        // const delRule = await account.functionCall(
        //     config.RULE_CONTRACT,
        //     'del_roles',
        //     {roles:[obj], ..._sign},
        //     '300000000000000'
        // );

        const delRule = await requestTransaction(
            account,
            config.RULE_CONTRACT,
            "del_roles",
            {roles:[obj], ..._sign},
            '300000000000000',
            '0',
        )
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
        const keyStore = new keyStores.InMemoryKeyStore();
        const near = await connect({
            keyStore,
            ...config,
        });
        const account = await near.account();
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
                    <div className={'file-item'}>
                        <div className={'name'}>Tx:</div>
                        <a className={['info tx',item.transaction_hash ? '' : 'hide'].join(' ')} href={config.explorerUrl+'/txns/'+item.transaction_hash} target="_blank">
                            <p className={'txt'}>{item.transaction_hash}</p>
                            <img src={jump}/>
                        </a>
                    </div>
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
            } else if (props.item.key_field[0] == "astrodao_id") {
                return (<div className={'file-list'}>
                    <div className={'file-item'}>
                        <div className={'name'}>Contract ID:</div>
                        <div className={'info'}>{props.item.key_field[1]}</div>
                    </div>
                    <div className={'file-item'}>
                        <div className={'name'}>DAO Role:</div>
                        <div className={'info'}>{props.item.fields.astrodao_role}</div>
                    </div>
                    {/* <div>{`appchain: ${props.item.key_field[1]}`}</div>
                    <div>{`role: ${props.item.fields.oct_role}`}</div> */}
                </div>)
            } else if (props.item.key_field[0] == "gating_rule") {
                if(props.item.key_field[1]=='Loyalty Level'){
                    return (<div className={'file-list'}>
                        <div className={'file-item'}>
                            <div className={'name'}>Gating Rule:</div>
                            <div className={'info'}>{props.item.key_field[1]}</div>
                        </div>
                        <div className={'file-item'}>
                            <div className={'name'}>Loyalty Level:</div>
                            <div className={'info'}>{props.item.fields.loyalty_level}</div>
                        </div>
                    </div>)
                }else if(props.item.key_field[1] == 'Paras Staking'){
                    return (<div className={'file-list'}>
                        <div className={'file-item'}>
                            <div className={'name'}>Gating Rule:</div>
                            <div className={'info'}>{props.item.key_field[1]}</div>
                        </div>
                        <div className={'file-item'}>
                            <div className={'name'}>Amount:</div>
                            <div className={'info'}>{formatAmount(props.item.fields.paras_staking_amount  || '', 18)}</div>
                        </div>
                        <div className={'file-item'}>
                            <div className={'name'}>Duration:</div>
                            <div className={'info'}>{props.item.fields.paras_staking_duration} days</div>
                        </div>
                    </div>)
                }else {
                    return '';
                }
                
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
            <div id="ruleLogin"></div>
        </div>
    );
}

export default SetRule;
