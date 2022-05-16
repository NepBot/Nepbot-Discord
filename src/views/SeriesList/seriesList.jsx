import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Input,message} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import AddSeries from "./addSeries";
import './series.css'

import {getRoleList, getServer, signRule} from "../../api/api";
import qs from "qs";
import store from "../../store/discordInfo";
import {formatAmount, sign} from "../../utils/util";

import logo from '../../assets/images/index/logo.png';
import add from '../../assets/images/setRule/add.png';
import no_data from '../../assets/images/no-data.png';

const config = getConfig()

function Series(props) {
    const [seriesList, setSeriesList] = useState([]);
    const [addDialogStatus, setAddDialogStatus] = useState(false);
    const [collectionId, setCollectionId] = useState("")
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

            setCollectionId(props.match.params.id)
        })();
        return () => {
        }
    }, []);

    const handleData = async (data) => {
        //get_token_metadata
        // const data = await account.viewFunction(config.NFT_CONTRACT, 'get_token_metadata', {hash: props.match.params.id})
        // setSeriesList(data)
        return data;
    }

    const handleAddStatus = useCallback(async () => {
        setAddDialogStatus(!addDialogStatus)
    }, []);



    function SeriesList(){
        if(seriesList.length>0){
            const seriesItems = seriesList.map((item,index) => 
                <div className={['series-item', (index%3===2) ? 'mr0' : ''].join(' ')} key={Math.random()}>
                    <img className={'cover'} alt="cover" src={no_data}/>
                    <div className={'info'}>
                        <div className={'name txt-wrap'}>{item.title}</div>
                        <div className={'account txt-wrap'}>Daisy</div>
                        <div className={'line'}></div>
                        <div className={'mint-info'}>
                            <div>Minted:</div>
                            <div className={'mint-number'}>20/{item.copies}</div>
                        </div>
                    </div>
                </div>
            );
            
            return (<div className={'series-list'}>
                {seriesItems}
            </div>)
        }
        else{
            return (<div className={'no-data'}>
                <img src={no_data}/>
                <div className={'tip'}>No data,please add a new item.</div>
            </div>)
        }
    }

    return (
        <div className={'page-box'}>
            <div className={'page-bg'}></div>
            <div className={'page-header'}>
                <div className={"title"}>Collection Name : {collectionDetail.name}</div>
                <Input className={'search-input'} bordered={false} placeholder="Enter a token ID to search" /> 
                <div className={'add-btn'} onClick={handleAddStatus}>
                    <img className={"add-icon"} src={add}/>
                    Add
                </div>
            </div>
            <SeriesList/>
            <AddSeries collectionId={collectionId}  visible={addDialogStatus}  onOk={handleAddStatus} onCancel={handleAddStatus}/>
        </div>
    );
}

export default Series;
