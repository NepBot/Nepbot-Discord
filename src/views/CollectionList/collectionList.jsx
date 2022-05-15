import React, {useCallback, useEffect, useState} from 'react';
import {message} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import AddCollection from "./addCollection";
import './collection.css'
import qs from "qs";
import store from "../../store/discordInfo";
import {formatAmount, sign} from "../../utils/util";
import {getRoleList, getServer, signRule, getOperationSign} from "../../api/api";
import logo from '../../assets/images/index/logo.png';
import add from '../../assets/images/setRule/add.png';
import no_data from '../../assets/images/no-data.png';

const config = getConfig()

function Collection(props) {
    let account = {}
    const guildData = qs.parse(props.location.search.slice(1));
    const [collectionList, setCollectionList] = useState([]);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [operationSign, setOperationSign] = useState("")
    const [server, setServer] = useState({});

    useEffect(() => {
        (async () => {
            // const search =  qs.parse(props.location.search.slice(1));
            // store.set("info", {
            //     guild_id: search.guild_id,
            //     user_id: search.user_id,
            //     sign: search.sign
            // }, { expires: 1 });

            // const near = await connect(config);
            // const wallet = new WalletConnection(near, 'nepbot');

            // try {
            //     await wallet._completeSignInWithAccessKey()
            // } catch {}

            // if (!wallet.isSignedIn()) {
            //     wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
            //     return
            // }
            // const accountId = wallet.getAccountId()
            // let operationSign = store.get("operationSign")
            // const args = {
            //     account_id: accountId, 
            //     user_id: search.user_id,
            //     guild_id: search.guild_id,
            //     sign: search.sign,
            //     operationSign: operationSign
            // }
            // const signature = await sign(wallet.account(), args)
            // operationSign = await getOperationSign({
            //     args: args,
            //     account_id: accountId,
            //     sign: signature 
            // })
            // setOperationSign(operationSign)
            // store.set("operationSign", operationSign, { expires: 1 })
            // const server = await getServer(search.guild_id);
            // setServer(server);
            // account = await wallet.account();
            // handleData();
        })();
        return () => {
        }
    }, [addDialogStatus]);

    const handleData = async (data) => {
        //get_collections_by_guild
        // const data = await account.viewFunction(config.NFT_CONTRACT, 'get_collections_by_guild', {guild_id: server.id})
        // setCollectionList(data)
        return data;
    }

    const handleAddStatus = useCallback(async () => {
        if (!addDialogStatus) {
            // const roles = await getRoleList(store.get("guild_id"));
            // setRoleList(roles.filter(item=>item.name!=="@everyone"))
        }else{
            message.info('Success');
        }
        setAddDialogStatus(!addDialogStatus)
    }, [addDialogStatus]);



    function CollectionList(){
        if(collectionList.length>0){
            const collectionItems = collectionList.map((item,index) => 
                <div className={['collection-item', (index%3===2) ? 'mr0' : ''].join(' ')} key={Math.random()}>
                    <img className={'cover'} alt="cover" src={no_data}/>
                    <div className={'info'}>
                        <div className={'user'}>
                            <img className={'avatar'} alt="avatar" src={no_data}/>
                            <div className={'user-info'}>
                                <div className={'name txt-wrap'}>irl#2869</div>
                                <div className={'account txt-wrap'}>Daisy</div>
                            </div>
                        </div>
                        <div className={'desc txt-wrap'}>Text Text Text Text Text Text  xt Text Text Text Text Text…</div>
                        <div className={'roles'}>
                            <div className="item">Near</div>
                            <div className="item">Oct</div>
                        </div>
                        <div className={'bottom-info'}>
                            <div className={'mod price'}>
                                Price
                                <div className="val">0.052</div>
                            </div>
                            <div className={'line'}></div>
                            <div className={'mod royality'}>
                                Royality
                                <div className="val">15%</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
            
            return (<div className={'collection-list'}>
                {collectionItems}
            </div>)
        }
        else{
            return (<div className={'no-data'}>
                <img src={no_data}/>
                <div className={'tip'}>No data,please add a new collection.</div>
            </div>)
        }
    }

    return (
        <div className={'page-box'}>
            <div className={'page-bg'}></div>
            <div className={'page-header'}>
                <div className={"title"}>Collections</div>
                <div className={'add-btn'} onClick={handleAddStatus}>
                    <img className={"add-icon"} src={add}/>
                    Add
                </div>
            </div>
            <CollectionList/>
            <AddCollection title="Basic Modal" roleList={roleList}  visible={addDialogStatus}  onOk={handleAddStatus} onCancel={handleAddStatus}/>
        </div>
    );
}

export default Collection;
