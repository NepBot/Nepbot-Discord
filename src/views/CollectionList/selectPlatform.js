import React,{useState} from 'react';
// import { config } from 'webpack';
import './selectPlatform.scss'
import logo_paras_large from '../../assets/images/collection/logo-paras-large.png';
// import logo_mintbase_large from '../../assets/images/collection/logo-mintbase-large.png';
import {getConfig} from "../../config";
const config = getConfig()
function SelectPlatform(props) {
    const { getPlatform } = props;
    // const [count, setCount] = useState<number>(0);
    const selectPlatform = (platform) => {
        getPlatform(platform);
    }
    if(props.visible){
        return <div className="select-platform">
            <div className="select-content">
                <div className="title">Select a Platform</div>
                <div className="tip">To create an NFT collection</div>
                <div className={"server"}>
                    <img className={"server-icon"} alt={props.server.name} src={props.server.iconURL}/>
                    <div className={"server-name"}>{props.server.name}</div>
                </div>
                <div className="platform">
                    <div className="platform-item" onClick={() => selectPlatform('paras')}>
                        <img className={'platform-logo'} alt="paras" src={logo_paras_large}/>
                        <div className={'platform-name'}>Paras</div>
                        <div className={'contract'}>{config.PARAS_CONTRACT}</div>
                    </div>
                    <div className="platform-item" onClick={() => selectPlatform('mintbase')}>
                        {/* <img className={'platform-logo'} alt="mintbase" src={logo_mintbase_large}/> */}
                        <img className={'platform-logo'} alt="paras" src={logo_paras_large}/>
                        <div className={'platform-name'}>Mintbase</div>
                        <div className={'contract'}>{config.MINTBASE_CONTRACT}</div>
                    </div>
                </div>
            </div>
        </div>;
    }else{
        return "";
    }
}

export default SelectPlatform;
