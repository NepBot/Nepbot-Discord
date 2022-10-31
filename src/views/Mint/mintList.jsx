import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import './mintList.scss'
import qs from "qs";
import store from "../../store/discordInfo";
import {formatAmount, sign} from "../../utils/util";
import {getRoleList, getServer, getUser, getOperationSign, getCollection, getMintbaseCollection} from "../../api/api";
import no_data from '../../assets/images/no-data.png';
import loading from '../../assets/images/loading.png';
import logo_paras from '../../assets/images/collection/logo-paras.png';
import logo_mintbase from '../../assets/images/collection/logo-mintbase.png';

const config = getConfig()

function MintList(props) {
    let account = {}
    const [isLoading, setIsLoading] = useState(true);
    // const [collectionList, setCollectionList] = useState([]);
    const [accessList,setAccessList] = useState([]);
    const [noAccessList,setNoAccessList] = useState([]);
    const [mintedOutList,setMintedOutList] = useState([]);
    // const [operationSign, setOperationSign] = useState("")
    const [server, setServer] = useState({});
    // const [roleList, setRoleList] = useState([]);
    const [roleMap, setRoleMap] = useState([]);
    const history = useHistory()

    useEffect(() => {
        (async () => {
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            try {
                await wallet._completeSignInWithAccessKey()
            } catch {}
            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return
            }
            
            //operationSign
            const search =  qs.parse(props.location.search.slice(1));
            store.set("info", {
                guild_id: search.guild_id,
                user_id: search.user_id,
                sign: search.sign
            }, { expires: 1 });
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
            store.set("operationSign", operationSign, { expires: 1 })
            //server
            const server = await getServer(search.guild_id);
            setServer(server);
            //formatdata
            account = wallet.account()
            handleData();
        })();
        return () => {
        }
    }, []);

    const handleData = async (data) => {
        const search =  qs.parse(props.location.search.slice(1));
        const roleList = [];
        const userInfo = await getUser(search.guild_id, search.user_id, search.sign)
        console.log(userInfo,'-------');
        if(userInfo && userInfo.data){
            userInfo.data.forEach(role=>{
                roleList.push(role.id);
            })
        }
        // const roleList = userInfo.roles;
        //setRoleMap
        const roles = await getRoleList(store.get("info").guild_id);
        const roleMap = {};
        roles.forEach(role =>{
            if(role.name!=="@everyone"){
                roleMap[role.id] = role.name;
            }
        })
        setRoleMap(roleMap);
        // setRoleList(roles.filter(item=>item.name!=="@everyone"))
        //
        // const info = store.get("info")
        setIsLoading(true);
        // try {
            const access = [];
            const noAccess = [];
            const mintedOut = [];
            //setCollectionList

            const collections = await account.viewFunction(config.NFT_CONTRACT, "get_collections_by_guild", {guild_id: search.guild_id})
            for (let collection of collections) {
                //royaltyTotal
                let royaltyTotal = 0;
                if(collection.royalty){
                    Object.keys(collection.royalty).forEach(key=>{
                        royaltyTotal += Number(collection.royalty[key]);
                    })
                }
                // console.log("11111111",collection);
                //
                let item = {};
                if(collection.contract_type == 'paras'){
                    const collectionData = await getCollection(collection.outer_collection_id)
                    if (collectionData && collectionData.results.length > 0) {
                        item = {
                            royaltyTotal:royaltyTotal/100,
                            inner_collection_id: collection.collection_id,
                            outer_collection_id: collection.outer_collection_id,
                            ...collection,
                            ...collectionData.results[0]
                        }
                    }
                }else if(collection.contract_type == 'mintbase'){
                    const collectionData = await getMintbaseCollection(collection.outer_collection_id)
                    if (collectionData) {
                        item = {
                            royaltyTotal:royaltyTotal/100,
                            inner_collection_id: collection.collection_id,
                            outer_collection_id: collection.outer_collection_id,
                            ...collection,
                            ...collectionData
                        }
                    }
                }
                // console.log("2222222",item);
                //get_collection
                const collectionInfo = await account.viewFunction(config.NFT_CONTRACT, "get_collection", {collection_id:collection.collection_id})
                // console.log("333333",collectionInfo);
                item = {
                    ...item,
                    creator : collectionInfo.creator_id,
                    minted_count : collectionInfo.minted_count,
                    total_copies : collectionInfo.total_copies,
                }
                
                if(item.minted_count >= item.total_copies){
                    mintedOut.push(item)
                }else if(item.mintable_roles && Array.from(new Set([...item.mintable_roles,...roleList])).length < item.mintable_roles.length + roleList.length){
                    access.push(item)
                }else{
                    noAccess.push(item)
                }
            }

            
            setAccessList(access)
            setNoAccessList(noAccess)
            setMintedOutList(mintedOut)
            console.log(access,noAccess,mintedOut);
            // handleData2(wrappedCollections)
        // } catch(e) {}
        setIsLoading(false);
        return data;
    }

    // const handleData2 = async (list) => {
    //     const result = [];
    //     for(let i = 0;i<list.length;i++){
    //         const item = list[i];
    //         const collection_id = item['inner_collection_id'];
    //         const collectionInfo = await account.viewFunction(config.NFT_CONTRACT, "get_collection", {collection_id:collection_id})
    //         item.creator = collectionInfo.creator_id;
    //         item.minted_count = collectionInfo.minted_count;
    //         item.total_copies = collectionInfo.total_copies;
    //         item.updated = true;
    //         result.push(item);
    //     }
    //     setCollectionList(result)
    // }

    function Roles(props){
        if(props.roles && props.roles.length>0){
            const setRoles = props.roles.map((item,index) => 
                <div className="item" key={item}>{roleMap[item]}</div>
            );
            return (<div className={'roles'}>
                {setRoles}
            </div>)
        }
        else{
            return <div className={'roles'}></div>
        }
    }


    function CollectionItem(props){
        if(props.item.contract_type=='paras'){
            return <div>
                <img className={'cover'} alt="cover" src={config.IPFS + props.item.cover}/>
                <div className={'user'}>
                    <div className={'media-box'}>
                        <img className={'media'} alt="media" src={config.IPFS + props.item.media}/>
                        <img className={'platform-logo'} alt="paras" src={logo_paras}/>
                    </div> 
                    <div className={'user-info'}>
                        <div className={'name txt-wrap'}>{props.item.collection.split("-guild-")[0].replaceAll("-", " ")}</div>
                        <div className={'account txt-wrap'}>{server.name}</div>
                        <div className={['creator txt-wrap',props.item.creator?'':'loading'].join(' ')} onClick={(e)=>{e.stopPropagation()}}>Created by &nbsp;
                            <span className={'dotting'}></span>
                            <a href={config.NEARBLOCKS+props.item.creator} target="_blank">{props.item.creator}</a>
                        </div>
                    </div>
                </div>
            </div>
        }else if(props.item.contract_type=='mintbase'){
            return <div>
                <img className={'cover'} alt="cover" src={props.item.background}/>
                <div className={'user'}>
                    <div className={'media-box'}>
                        <img className={'media'} alt="media" src={props.item.logo}/>
                        <img className={'platform-logo'} alt="mintbase" src={logo_mintbase}/>
                    </div>
                    <div className={'user-info'}>
                        <div className={'name txt-wrap'}>{props.item.name}</div>
                        <div className={'account txt-wrap'}>{server.name}</div>
                        <div className={['creator txt-wrap',props.item.creator?'':'loading'].join(' ')}>Created by &nbsp;
                            <span className={'dotting'}></span>
                            {props.item.creator}
                        </div>
                    </div>
                </div>
            </div>
        }else{
            return '';
        }
    }

    function CollectionList(props){
        if(props.data.length>0){
            const collectionItems = props.data.map((item,index) => 
                <div className={['collection-item', (index%3===2) ? 'mr0' : ''].join(' ')} key={Math.random()}>
                    <CollectionItem item={item}/>
                    <div className={'info'}>
                        <div className={'desc txt-wrap'}>{item.description}</div>
                        <Roles roles={item.mintable_roles}></Roles>
                        <div className={'bottom-info'}>
                            <div className={'mod price'}>
                                <div className="val">{item.price && formatAmount(item.price,24,4)}</div>
                                Price
                            </div>
                            <div className={'mod royality'}>
                                <div className="val">{item.royaltyTotal}%</div>
                                Royality
                            </div>
                            <div className={'mod copies'}>
                                <div className={'val'}>
                                    <span className={'count'}>{item.total_copies}</span>
                                </div>
                                Total Copies
                            </div>
                            <div className={'mod minted'}>
                                <div className={'val'}>
                                    <span className={'count'}>{item.minted_count}</span>
                                </div>
                                Total Minted
                            </div>
                        </div>
                    </div>
                </div>
            );
            
            return (<div className={'collection-list'}>
                {collectionItems}
            </div>)
        }
        else if(isLoading && props.mod=='access'){
            return (<div className={'no-result'}>
                <img className={"page-loading"}  src={loading}/>
            </div>)
        }else if(props.data.length==0 && props.mod=='access'){
            return (<div className={'no-result'}>
                <img src={no_data}/>
                <div className={'tip'}>Sorry, there’s no collection currently available to mint.</div>
            </div>)
        }else{
            return "";
        }
    }

    return (
        <div className={'page-box mintlist'}>
            <div className={'page-bg'}></div>
            <div className={'page-header'}>
                <div className={"title"}>Collections</div>
            </div>
            <div className={'list'}>
                <div className={'mod-title access'}>You Have Access</div>
                <CollectionList data={accessList} mod={'access'}/>
                <div className={['mod-title no-access',noAccessList.length>0?'':'hide'].join(' ')}>No Access</div>
                <CollectionList data={noAccessList} mod={'noAccess'}/>
                <div className={['mod-title minted-out',mintedOutList.length>0?'':'hide'].join(' ')}>Minted Out</div>
                <CollectionList data={mintedOutList} mod={'mintedOut'}/>
            </div>
        </div>
    );
}

export default MintList;
