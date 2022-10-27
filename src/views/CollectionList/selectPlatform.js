import React,{useState} from 'react';
// import {useHistory} from 'react-router-dom'
// import {connect, WalletConnection} from "near-api-js";
// import {signRule,createCollection, getCollection} from "../../api/api";
// import {contract, parseAmount, sign} from "../../utils/util";
import './selectPlatform.scss'

function SelectPlatform(props) {
    const { getPlatform } = props;
    // const [count, setCount] = useState<number>(0);
    const selectPlatform = (platform) => {
        getPlatform(platform);
    }
    if(props.visible){
        return <div className="select-platform">
            <div className="select-content">
                <div className="platform-item" onClick={() => selectPlatform('paras')}>Paras</div>
                <div className="platform-item" onClick={() => selectPlatform('mintbase')}>Mintbase</div>
            </div>
        </div>;
    }else{
        return "";
    }
}

export default SelectPlatform;
