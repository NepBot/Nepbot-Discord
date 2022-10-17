import React, { useState, useEffect} from 'react';
import qs from "qs";
import './success.css';
import success from '../../assets/images/icon-success.png';

function Success(props) {
    const [type, setType] = useState('');
    const [info, setInfo] = useState('');
    useEffect(()=>{

        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            if(search.from){
                setType(search.from);
                if(search.from == 'twitterverify'){
                    setInfo(localStorage.getItem('twitterVerifyInfo') || '')
                    localStorage.removeItem('twitterVerifyInfo')
                }else{
                    setTimeout(async ()=>{
                        window.location.href="https://discord.com/channels/"
                    },5000)
                }
            }
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    function Content(){
        if(type === 'twitterverify'){
            return (<div className={'twitter'}>
                <div className={'head'}>Twitter connected.</div>
                <div className={'text'}>
                    <div dangerouslySetInnerHTML = {{ __html:  info}}></div>
                </div>
            </div>)
        }else{
            return (<div>
                <div className={'head'}>Well done!</div>
                <div className={'text'}>
                    Wallet is connected.<br/>
                    Please go back to Discord and check your roles! :)
                </div>
            </div>)
        }
    }
    
    return (
        <div className={'success-box'}>
            <div className={'success-content'}>
                <img className={'pic'} src={success}/>
                <Content/>
            </div>
        </div>
    );
}

export default  Success;
