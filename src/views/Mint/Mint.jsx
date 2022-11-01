import React, { useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {InputNumber} from "antd";
import {getMintSign, setInfo, getCollection, getMintbaseCollection} from "../../api/api";
import store from "../../store/discordInfo";
import {formatAmount, parseAmount,sign} from "../../utils/util";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import qs from "qs";
import './Mint.scss';
import loading from '../../assets/images/loading.png';
import BN from 'bn.js'
import { requestTransaction } from '../../utils/contract';
import icon_tip from '../../assets/images/icon-i.png';

const config = getConfig()

export default function Mint(props) {
    const history = useHistory()
    const [checkStatus, setCheckStatus] = useState(0);
    const [mintStatus, setMintStatus] = useState(false);
    const [mintCount, setMintCount] = useState(1);

    const mint = async () => {
        if(checkStatus==1 || checkStatus==2){
            return;
        }
        setMintStatus(true);

        const near = await connect(config);
        const wallet = new WalletConnection(near, 'nepbot');
        const account = wallet.account(); 
        
        const info = store.get("info")
        const accountId = wallet.getAccountId()
        const args = {
            user_id: info.user_id,
            guild_id: info.guild_id,
            collection_id: props.collectionInfo.inner_collection_id,
            sign: props.sign
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
        const price = new BN(parseAmount((formatAmount(props.collectionInfo.price) * mintCount).toString())).add(new BN('20000000000000000000000'));
        const res = await requestTransaction(
            account,
            config.NFT_CONTRACT,
            "nft_mint",
            {
                collection_id: props.collectionInfo.inner_collection_id,
                ..._sign
            },
            '300000000000000',
            price.toString(),
            `${window.location.origin}/mintsuccess`
        )
        setMintStatus(false);
    }

    const onChange = (val) => {
        if(props.collectionInfo.mint_count_limit && val>props.collectionInfo.mint_count_limit){
            setCheckStatus(1);
        }else if(val>props.collectionInfo.total_copies - props.collectionInfo.minted_count){
            setCheckStatus(2);
        }else{
            setCheckStatus(0);
            setMintCount(val);
        }
    }

    const cancle = () => {
        setCheckStatus(0);
        setMintCount(1);
        setCheckStatus(false);
        props.onCancle();
    }

    
    if(props.visible){
        return (
            <div className={'mint-box'}>
                <div className={['mint-content','mint-content-'+props.collectionInfo.contract_type].join(' ')}>
                    <div className={'close-btn'} onClick={cancle}></div>

                    <img className={'media'} src={props.collectionInfo._media}/>
                    <div className={'name'}>{props.collectionInfo.name}</div>
                    <div className={'count'}>{(props.collectionInfo.total_copies - props.collectionInfo.minted_count)}/{props.collectionInfo.total_copies} Available</div>

                    <div className={'mint-number'}>
                        <InputNumber bordered={false} onChange={onChange} min={1} placeholder="Enter a number to mint" type="number"/>
                    </div>
                    <div className={['limit-check',checkStatus===2?'show':''].join(' ')}>Exceeds available amount</div>
                    <div className={['limit',props.collectionInfo.mint_count_limit?'':'hide',checkStatus===1?'error':''].join(' ')}>
                        Minting Limit: {props.collectionInfo.mint_count_limit}
                        <div  className={'tip-box'}>
                            <img className={'tip-icon'} src={icon_tip}/>
                            <div className={'tip'}>The maximum number of NFTs that can be minted per wallet.</div>
                        </div>
                    </div>
                    <div className={['mint-btn',mintStatus?'loading':'',(checkStatus == 1 || checkStatus == 2) ? 'disabled' : ''].join(' ')} onClick={mint}>
                        <span>Mint</span>
                        <img src={loading}/>
                    </div>
                    
                </div>
            </div>
        )
    }else{
        return ''
    }
}
