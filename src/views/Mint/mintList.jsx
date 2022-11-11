import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {connect, WalletConnection, keyStores} from "near-api-js";
import WalletSelector from '../../utils/walletSelector';
import {getConfig} from "../../config";
import Mint from "./Mint";
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
    const [accessList,setAccessList] = useState([]);
    const [noAccessList,setNoAccessList] = useState([]);
    const [mintedOutList,setMintedOutList] = useState([]);
    const [operationSign, setOperationSign] = useState("")
    const [server, setServer] = useState({});
    const [roleMap, setRoleMap] = useState([]);
    const [mintDialogStatus, setMintDialogStatus] = useState(false);
    const [selectedCollection, setSelectedCollection] =  useState({});
    const history = useHistory()

    useEffect(() => {
        (async () => {
            // const near = await connect(config);
            // const wallet = new WalletConnection(near, 'nepbot');
            const walletSelector = await WalletSelector.new({})
            if (!walletSelector.selector.isSignedIn()) {
                const selector = document.getElementById("near-wallet-selector-modal");
                walletSelector.modal.show();
                selector.getElementsByClassName('nws-modal-overlay')[0].style.display= 'none';
                selector.getElementsByClassName('close-button')[0].style.display= 'none';
                return
            }
            const wallet = await walletSelector.selector.wallet()
            const accountId = (await wallet.getAccounts())[0].accountId
            const privateKey = await walletSelector.getPrivateKey(accountId)
            const keyStore = new keyStores.InMemoryKeyStore();
            const near = await connect({
                keyStore,
                ...config,
            });
            account = await near.account();
            
            //getUser roleList
            let roleList = []
            const search =  qs.parse(props.location.search.slice(1));
            store.set("info", {
                guild_id: search.guild_id,
                user_id: search.user_id,
                sign: search.sign
            }, { expires: 1 });
            const userInfo = await getUser(search.guild_id, search.user_id, search.sign)
            if(userInfo){
                roleList = userInfo.roles;
            }else{
                history.push({pathname: '/linkexpired', })
                return
            }

            //operationSign
            let _operationSign = store.get("operationSign")
            const args = {
                account_id: accountId, 
                user_id: search.user_id,
                guild_id: search.guild_id,
                sign: search.sign,
                operationSign: _operationSign
            }
            const signature = await sign(privateKey, args)
            _operationSign = await getOperationSign({
                args: args,
                account_id: accountId,
                sign: signature 
            })
            if (!_operationSign) {
                history.push({pathname: '/linkexpired', })
                return
            }
            setOperationSign(_operationSign);
            store.set("operationSign", _operationSign, { expires: 1 })
            //server
            const server = await getServer(search.guild_id);
            setServer(server);
            //formatdata
            // account = wallet.account()
            handleData(roleList);
        })();
        return () => {
        }
    }, []);

    const handleData = async (roleList) => {
        //setRoleMap
        const roles = await getRoleList(store.get("info").guild_id);
        const roleMap = {};
        roles.forEach(role =>{
            if(role.name!=="@everyone"){
                roleMap[role.id] = role.name;
            }
        })
        setRoleMap(roleMap);

        //setCollectionList
        setIsLoading(true);
        const access = [];
        const noAccess = [];
        const mintedOut = [];
        let collections = []
        try {
            collections = await account.viewFunction(config.NFT_CONTRACT, "get_collections_by_guild", {guild_id: store.get("info").guild_id})
        } catch(e) {}

        for (let collection of collections) {
            try {
                //royaltyTotal
                let royaltyTotal = 0;
                if(collection.royalty){
                    Object.keys(collection.royalty).forEach(key=>{
                        royaltyTotal += Number(collection.royalty[key]);
                    })
                }
                //
                let item = {};
                if(collection.contract_type == 'paras'){
                    const collectionData = await getCollection(collection.outer_collection_id)
                    if (collectionData && collectionData.results.length > 0) {
                        item = {
                            name : collection.collection_id.split(":")[1].split("-guild-")[0].replaceAll("-", " "),
                            _cover : config.IPFS + collectionData.results[0]['cover'],
                            _media : config.IPFS + collectionData.results[0]['media'],
                            contract : config.PARAS_CONTRACT,
                            royaltyTotal:royaltyTotal/100,
                            inner_collection_id: collection.collection_id,
                            outer_collection_id: collection.outer_collection_id,
                            ...collection,
                            ...collectionData.results[0]
                        }
                    }
                }else if(collection.contract_type == 'mintbase'){
                    console.log('mintbase');
                    const collectionData = await getMintbaseCollection(collection.outer_collection_id)
                    if (collectionData) {
                        item = {
                            royaltyTotal:royaltyTotal/100,
                            inner_collection_id: collection.collection_id,
                            outer_collection_id: collection.outer_collection_id,
                            _media:collectionData.logo,
                            _cover:collectionData.background,
                            ...collection,
                            ...collectionData,

                        }
                    }
                }
                //get_collection
                const collectionInfo = await account.viewFunction(config.NFT_CONTRACT, "get_collection", {collection_id:collection.collection_id})
                item = {
                    ...item,
                    creator : collectionInfo.creator_id,
                    minted_count : collectionInfo.minted_count,
                    total_copies : collectionInfo.total_copies,
                }
                
                if(item.minted_count >= item.total_copies){
                    mintedOut.push(item)
                }else if(!item.mintable_roles || (item.mintable_roles && Array.from(new Set([...item.mintable_roles,...roleList])).length < item.mintable_roles.length + roleList.length)){
                    access.push(item)
                }else{
                    noAccess.push(item)
                }
            } catch(e) {
                continue;
            }
        }

        setAccessList(access)
        setNoAccessList(noAccess)
        setMintedOutList(mintedOut)
        setIsLoading(false);
    }


    const mint = useCallback(async (mod,item) => {
        if(mod != 'access'){return}
        setSelectedCollection(item);
        setMintDialogStatus(!mintDialogStatus)
        document.getElementsByTagName('body')[0].classList.add("fixed");
    }, [mintDialogStatus]);

    const onCancel = useCallback(async () => {
        document.getElementsByTagName('body')[0].classList.remove("fixed");
        setMintDialogStatus(!mintDialogStatus)
    }, [mintDialogStatus]);


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
                <img className={'cover'} alt="cover" src={props.item._cover}/>
                <div className={'user'}>
                    <div className={'media-box'}>
                        <img className={'media'} alt="media" src={props.item._media}/>
                        <img className={'platform-logo'} alt="paras" src={logo_paras}/>
                    </div> 
                    <div className={'user-info'}>
                        <div className={'name txt-wrap'}>{props.item.name}</div>
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
                <img className={'cover'} alt="cover" src={props.item._cover}/>
                <div className={'user'}>
                    <div className={'media-box'}>
                        <img className={'media'} alt="media" src={props.item._media}/>
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
                <div className={['collection-item', `collection-${props.mod}-item`,(index%3===2) ? 'mr0' : ''].join(' ')} key={Math.random()} onClick={()=>mint(props.mod,item)}>
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
                <CollectionList data={noAccessList} mod={'noaccess'}/>
                <div className={['mod-title minted-out',mintedOutList.length>0?'':'hide'].join(' ')}>Minted Out</div>
                <CollectionList data={mintedOutList} mod={'mintedout'}/>
            </div>
            <Mint visible={mintDialogStatus} collectionInfo={selectedCollection} sign={operationSign} onCancel={onCancel}/>
        </div>
    );
}

export default MintList;
