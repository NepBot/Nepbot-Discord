import React, { useState, useEffect} from 'react';
import qs from "qs";
import './success.scss';
import success from '../../assets/images/icon-success.png';

function Success(props) {
    useEffect(()=>{

        (async ()=>{
            // const search =  qs.parse(props.location.search.slice(1));
            // if(search.from){
            //     setType(search.from);
            //     if(search.from == 'twitterverify'){
            //         setInfo(localStorage.getItem('twitterVerifyInfo') || '')
            //         localStorage.removeItem('twitterVerifyInfo')
            //     }else{
            //         setTimeout(async ()=>{
            //             window.location.href="https://discord.com/channels/"
            //         },5000)
            //     }
            // }
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])
    
    return (
        <div className={'success-box'}>
            <div className={'success-content'}>
                <img className={'pic'} src={success}/>
                <div className={'head'}>✅ Congratulations!</div>
                <div className={'text'}>
                    Your NFT has been minted successfully.<br/>
                    Check and refresh you wallet as it might not apprear immediately. 
                </div>
            </div>
        </div>
    );
}

export default  Success;
