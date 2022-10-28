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
    const [showList, setShowList] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [collectionInfo, setCollectionInfo] = useState({
        collection_id : props.match.params.id,
        creator : '',
        minted_count : 0,
        total_copies : 0,
        name : props.match.params.id.split(":")[1].split("-guild-")[0].replaceAll("-", " ")

    })
    const history = useHistory()

    useEffect(() => {
        (async () => {
            const info = store.get("info")
            const operationSign = store.get("operationSign")
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            if (!info || !wallet.isSignedIn() || !operationSign) {
                history.push({pathname: '/linkexpired', })
            }
            account = wallet.account()
            handleData()
        })();
        return () => {
        }
    }, []);

    const handleData = async (data) => {
        //get_token_metadata
        try{
            const search =  qs.parse(props.location.search.slice(1));
            setIsLoading(true);
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            account = wallet.account()
            const collectionInfo = await account.viewFunction(config.NFT_CONTRACT, "get_collection", {collection_id:props.match.params.id})
            console.log(collectionInfo,'---collectionInfo---');
            const server = await getServer(search.guild_id);
            setCollectionInfo({
                collection_id : props.mach.params.id,
                creator : collectionInfo.creator_id,
                minted_count : collectionInfo.minted_count,
                total_copies : collectionInfo.total_copies,
                name : props.match.params.id.split(":")[1].split("-guild-")[0].replaceAll("-", " "),
                server : server.name,
            })
            

            const res = await account.viewFunction(config.NFT_CONTRACT, 'get_token_metadata', {collection_id: props.match.params.id})
            setSeriesList(res)
            setShowList(res)
            
        }catch(e) {
            console.log(e);
        }
        setIsLoading(false);
        return data;
    }

    const handleAddStatus = useCallback(async () => {
        if (!addDialogStatus) {
            
        }else{
            handleData();
            // message.info('Success');
        }
        setAddDialogStatus(!addDialogStatus)
    }, [addDialogStatus]);

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
        window.open(`${config.PARAS}/token/${config.PARAS_CONTRACT}::${id}`,'_blank')
    }

    const backCollectionList = () => {
        // console.log(history,document.location);
        history.push({pathname: `/collectionlist`,search:props.location.search})
        // history.go(-1);
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
                <div className={'tip'}>No data, please add a new item.</div>
            </div>)
        }
    }

    return (
        <div className={'page-box'}>
            <div className={'page-bg'}></div>
            <div className={'page-header series-page-header'}>
                <div className={'back-collection-list'} onClick={backCollectionList}></div>
                <div className={"title"}>Collection Name : {collectionInfo.name}</div>
                <Input.Search onSearch={handleSearch} className={'search-input'} bordered={false} placeholder="Enter a token ID to search" /> 
                <div className={'add-btn'} onClick={handleAddStatus}>
                    <img className={"add-icon"} src={add}/>
                    Add
                </div>
            </div>
            <SeriesList/>
            <AddSeries collectionId={collectionInfo.collection_id} collectionName={collectionInfo.name} visible={addDialogStatus}  onOk={handleAddStatus} onCancel={handleAddStatus}/>
        </div>
    );
}

export default Series;
