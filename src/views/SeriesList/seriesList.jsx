import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Input,message} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import AddSeries from "./addSeries";
import './series.scss'

import {getRoleList, getServer, signRule, getCollection, getMintbaseCollection} from "../../api/api";
import qs from "qs";
import store from "../../store/discordInfo";
import {formatAmount, sign} from "../../utils/util";

import logo from '../../assets/images/index/logo.png';
import add from '../../assets/images/setRule/add.png';
import no_data from '../../assets/images/no-data.png';
import loading from '../../assets/images/loading.png';
import discordIcon from '../../assets/images/collection/discord.png';

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

            const collection = await account.viewFunction(config.NFT_CONTRACT, "get_collection", {collection_id:props.match.params.id})
            const server = await getServer(search.guild_id);

            const info = {
                collection_id : props.match.params.id,
                creator : collection.creator_id,
                minted_count : collection.minted_count,
                total_copies : collection.total_copies,
                serverName : server.name,
                serverIcon : server.iconURL || discordIcon,
            }
            if(collection.contract_type =='paras'){
                const collectionData = await getCollection(collection.outer_collection_id)
                info.name = props.match.params.id.split(":")[1].split("-guild-")[0].replaceAll("-", " ");
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
            setCollectionInfo(info)
            
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
            return (<div className={'no-result'}>
                <img className={"page-loading"}  src={loading}/>
            </div>)
        }
        else{
            return (<div className={'no-result'}>
                <img  src={no_data}/>
                <div className={'tip'}>No data, please add a new item.</div>
                <div className={'add-btn'} onClick={handleAddStatus}>
                    <img className={"add-icon"} src={add}/>
                    Add
                </div>
            </div>)
        }
    }

    return (
        <div className={'page-box'}>
            <div className={'page-bg'}></div>
            <div className={'page-header series-page-header'}>
                <div className={'back-collection-list'} onClick={backCollectionList}></div>
                <Input.Search onSearch={handleSearch} className={'search-input'} bordered={false} placeholder="Enter a token ID to search" /> 
                <div className={'add-btn'} onClick={handleAddStatus}>
                    <img className={"add-icon"} src={add}/>
                    Add
                </div>
            </div>
            <div className={'collection-info'}>
                <img className={"cover"} alt="cover" src={collectionInfo.cover}/>
                <div className={"info"}>
                    <img className={"logo"} alt="logo" src={collectionInfo.logo}/>
                    <div className={"server"}>
                        <img className={"server-icon"} alt="" src={collectionInfo.serverIcon}/>
                        <div className={"server-name"}>{collectionInfo.serverName}</div>
                    </div>
                    <div className={"title"}>{collectionInfo.name}</div>
                    <div className={"creator"}>Created by  : <a className={'val'} href={config.NEARBLOCKS+collectionInfo.creator} target="_blank">{collectionInfo.creator}</a></div>
                    <div className={"contract"}>Contract  : <a className={'val'} href={config.NEARBLOCKS+collectionInfo.contract} target="_blank">{collectionInfo.contract}</a></div>
                    <div className={"count"}>
                        <div className={"count-item"}><span className={'val'}>{collectionInfo.total_copies}</span>Total Copies</div>
                        <div className={"count-item"}><span className={'val'}>{collectionInfo.minted_count}</span>Total Minted</div>
                    </div>
                    <div className={"description"}>{collectionInfo.description}</div>
                </div>
            </div>
            <SeriesList/>
            <AddSeries collectionId={collectionInfo.collection_id} collectionName={collectionInfo.name} visible={addDialogStatus}  onOk={handleAddStatus} onCancel={handleAddStatus}/>
        </div>
    );
}

export default Series;
