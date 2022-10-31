import React, { useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {InputNumber} from "antd";
import {getMintSign, setInfo, getCollection, getMintbaseCollection} from "../../api/api";
import store from "../../store/discordInfo";
import {sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import qs from "qs";
import './Mint.scss';
import load from '../../assets/images/load.gif';
import BN from 'bn.js'
import { requestTransaction } from '../../utils/contract';
import icon_tip from '../../assets/images/icon-i.png';

const config = getConfig()

export default function Success(props) {
    const history = useHistory()
    const [checkStatus, setCheckStatus] = useState(0);
    const [mintStatus, setMintStatus] = useState(false);
    const [mintCount, setMintCount] = useState(1);
    const [collectionInfo, setCollectionInfo] = useState(null)
    useEffect(()=>{
        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            store.set("info", {
                guild_id: search.guild_id,
                user_id: search.user_id,
                collection_id: search.collection_id,
                sign: search.sign
            }, { expires: 1 });

            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            const account = wallet.account(); 

            try {
                await wallet._completeSignInWithAccessKey()
            } catch {}

            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return
            }
            
            let collection = null;
            try{
                collection = await account.viewFunction(config.NFT_CONTRACT, "get_collection", {collection_id: search.collection_id})
                const info = {
                    price:collection.price,
                    contract_type : collection.contract_type,
                    minted_count : collection.minted_count,
                    total_copies : collection.total_copies,
                    limit : collection.mint_count_limit,
                }
                if(collection.contract_type =='paras'){
                    const collectionData = await getCollection(collection.outer_collection_id)
                    info.name = collection.collection_id.split(":")[1].split("-guild-")[0].replaceAll("-", " ");
                    info.cover = config.IPFS + collectionData.results[0]['cover'];
                    info.logo = config.IPFS + collectionData.results[0]['media'];
                    info.contract = config.PARAS_CONTRACT;
                    info.description = collectionData.results[0]['description'];
                }else if(collection.contract_type == 'mintbase'){
                    info.contract = config.MINTBASE_CONTRACT;
                    const collectionData = await getMintbaseCollection(collection.outer_collection_id)
                    if (collectionData) {
                        info.name = collectionData.name;
                        info.description = collectionData.description;
                        info.cover = collectionData.background;
                        info.logo = collectionData.logo;
                    }
                }
                console.log(collection,info,'---collection--');
                setCollectionInfo(info);
            }catch(e){
                console.log(e);
                // history.push({pathname: `/failure`})
            }
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    const mint = async () => {
        if(checkStatus==1 || checkStatus==2){
            return;
        }
        // setMintStatus(true);

        const near = await connect(config);
        const wallet = new WalletConnection(near, 'nepbot');
        const account = wallet.account(); 
        
        const search =  qs.parse(props.location.search.slice(1));
        const accountId = wallet.getAccountId()
        const args = {
            user_id: search.user_id,
            guild_id: search.guild_id,
            collection_id: search.collection_id,
            sign: search.sign
        }

        const signature = await sign(wallet.account(), args)
        const _sign = await getMintSign({
            args: args,
            account_id: accountId,
            sign: signature
        })
        if(!_sign) {
            history.push({pathname: '/linkexpired', })
            return
        }

        const price = new BN(collectionInfo.price * mintCount).add(new BN('20000000000000000000000'))
        console.log(account,config.NFT_CONTRACT,search.collection_id,_sign,price.toString());
        const res = await requestTransaction(
            account,
            config.NFT_CONTRACT,
            "nft_mint",
            {
                collection_id: search.collection_id,
                ..._sign
            },
            '300000000000000',
            price.toString(),
            `${window.location.origin}/mintsuccess`
        )
    }

    const onChange = (val) => {
        if(collectionInfo.limit && val>collectionInfo.limit){
            setCheckStatus(1);
        }else if(val>collectionInfo.total_copies - collectionInfo.minted_count){
            setCheckStatus(2);
        }else{
            setCheckStatus(0);
            setMintCount(val);
        }
        
    }

    // const handleDiscord = useCallback(()=>{
    //     window.open('https://discord.com/channels/','_self')
    // },[])


    
    if(!mintStatus && collectionInfo){
        return (
            <div className={'mint-box'}>
                <div className={['mint-content','mint-content'+collectionInfo.contract_type].join(' ')}>
                    <img className={'media'} src={collectionInfo.logo}/>
                    <div className={'name'}>{collectionInfo.name}</div>
                    <div className={'count'}>{(collectionInfo.total_copies - collectionInfo.minted_count)}/{collectionInfo.total_copies} Available</div>

                    <div className={'mint-number'}>
                        <InputNumber bordered={false} onChange={onChange} min={1} placeholder="Enter a number to mint" type="number"/>
                    </div>
                    <div className={['limit-check',checkStatus===2?'show':''].join(' ')}>Exceeds available amount</div>
                    <div className={['limit',collectionInfo.limit?'':'hide',checkStatus===1?'error':''].join(' ')}>
                        Minting Limit: {collectionInfo.limit}
                        <div  className={'tip-box'}>
                            <img className={'tip-icon'} src={icon_tip}/>
                            <div className={'tip'}>The maximum number of NFTs that can be minted per wallet.</div>
                        </div>
                    </div>
                    <div className={['mint-btn',(checkStatus == 1 || checkStatus == 2) ? 'disabled' : ''].join(' ')} onClick={mint}>Mint</div>
                    
                </div>
            </div>
        )
    }else{
        return (
            <div className={'loading-box'}>
                <div className={'loading-content'}>
                    <img src={load}/>
                    <div className={'text'}>Loading…</div>
                </div>
            </div>
        )
    }
}
