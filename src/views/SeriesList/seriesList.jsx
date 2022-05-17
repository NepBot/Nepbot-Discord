import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Input,message} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import AddSeries from "./addSeries";
import './series.css'

import {getRoleList, getServer, signRule, getCollection} from "../../api/api";
import qs from "qs";
import store from "../../store/discordInfo";
import {formatAmount, sign} from "../../utils/util";

import logo from '../../assets/images/index/logo.png';
import add from '../../assets/images/setRule/add.png';
import no_data from '../../assets/images/no-data.png';
import loading from '../../assets/images/loading.png';

const config = getConfig()

function Series(props) {
    let account = {}
    const [searchStr] =  useState("");
    const [showList, setShowList] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [collectionId, setCollectionId] = useState("")
    const [collectionName, setCollectionName] = useState("")
    const history = useHistory()
    // const [roleList, setRoleList] = useState([]);
    const [collectionDetail, setCollectionDetail] =  useState({});

    useEffect(() => {
        (async () => {
            const info = store.get("info")
            const operationSign = store.get("operationSign")
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            if (!info || !wallet.isSignedIn() || !operationSign) {
                history.push({pathname: '/linkexpired', })
            }
            const collectionId = props.match.params.id
            setCollectionId(collectionId)
            setCollectionName(collectionId.split(":")[1].split("-")[0])
            account = wallet.account()
            handleData()
        })();
        return () => {
        }
    }, []);

    const handleData = async (data) => {
        //get_token_metadata
        try{
            setIsLoading(true);
            // console.log(collectionId)
            const res = await account.viewFunction(config.NFT_CONTRACT, 'get_token_metadata', {collection_id: props.match.params.id})
            setSeriesList(res)
            setShowList(res)
            console.log(res); 
            
        }catch(e) {
            console.log(e);
        }
        setIsLoading(false);
        return data;
    }

    const handleAddStatus = useCallback(async () => {
        setAddDialogStatus(!addDialogStatus)
    }, []);

    const handleSearch = (value) => {
        const list = [];
        seriesList.forEach(item=>{
            if(item.metadata.title.indexOf(value)>-1){
                list.push(item);
            }
        })
        setShowList(list);
    }

    const handleSeries = (id) => {
        window.open(`https://testnet.paras.id/token/paras-token-v2.testnet::${id}`,'_blank')
    }



    function SeriesList(){
        if(showList.length>0){
            const seriesItems = showList.map((item,index) => 
                <div className={['series-item', (index%3===2) ? 'mr0' : ''].join(' ')} key={Math.random()} onClick={() => handleSeries(item.token_series_id)}>
                    <img className={'cover'} alt="cover" src={'https://ipfs.fleek.co/ipfs/'+item.metadata.media}/>
                    <div className={'info'}>
                        <div className={'name txt-wrap'}>{item.metadata.title}</div>
                        <div className={'account txt-wrap'}>{item.metadata.description}</div>
                        <div className={'line'}></div>
                        <div className={['mint-info',item.copies ? '' : 'hidden'].join(" ")}>
                            <div>Minted:</div>
                            <div className={'mint-number'}>{item.minted_count}/{item.copies}</div>
                        </div>
                    </div>
                </div>
            );
            
            return (<div className={'series-list'}>
                {seriesItems}
            </div>)
        }
        else if(isLoading){
            return (<div className={'no-data'}>
                <img className={"page-loading"}  src={loading}/>
            </div>)
        }
        else{
            return (<div className={'no-data'}>
                <img  src={no_data}/>
                <div className={'tip'}>No data,please add a new item.</div>
            </div>)
        }
    }

    return (
        <div className={'page-box'}>
            <div className={'page-bg'}></div>
            <div className={'page-header'}>
                <div className={"title"}>Collection Name : {collectionName}</div>
                <Input.Search onSearch={handleSearch} className={'search-input'} bordered={false} placeholder="Enter a token ID to search" /> 
                <div className={'add-btn'} onClick={handleAddStatus}>
                    <img className={"add-icon"} src={add}/>
                    Add
                </div>
            </div>
            <SeriesList/>
            <AddSeries collectionId={collectionId} collectionName={collectionName} visible={addDialogStatus}  onOk={handleAddStatus} onCancel={handleAddStatus}/>
        </div>
    );
}

export default Series;
