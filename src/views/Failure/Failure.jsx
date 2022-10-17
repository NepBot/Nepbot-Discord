import React, {useCallback, useEffect, useState} from 'react';
import './failure.css';
import failure from '../../assets/images/fail.png';
import qs from "qs";



function Failure(props) {
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [info, setInfo] = useState('');
    useEffect(()=>{
        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            if(search.from){
                setType(search.from);
                if(search.from === 'twitterverify'){
                    setStatus(search.status);
                    setInfo(localStorage.getItem('twitterVerifyInfo') || '')
                    localStorage.removeItem('twitterVerifyInfo')
                }
            }
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    function Content(){
        if(type === 'airdrop'){
            return (
                <div>
                    <div className={'head'}>Oops!</div>
                    <div className={'text'}>
                        <span>Something went wrong. Please check the transaction on Near Explorer.</span>
                        <a className={"text-strong"} href="https://discord.com/channels/" target="_self">Support</a>
                    </div>
                </div>
            )
        }else if(type === 'twitterverify'){
            if(status==1){
                return (
                <div className={"twitter"}>
                    <div className={'head'}>Twitter is connected, but ... </div>
                    <div className={'text '}>
                        <div dangerouslySetInnerHTML = {{ __html:  info}}></div>
                    </div>
                </div>
                )
            }else{
                return (
                <div>
                    <div className={'head'}>Oops!</div>
                    <div className={'text'}>
                        <span>Verification failed. </span> 
                        <a className={"text-strong"} href="https://discord.com/channels/" target="_self">Support</a>
                    </div>
                </div>
                )
            }
        }else{
            return (
            <div>
                <div className={'head'}>Oops!</div>
                <div className={'text'}>
                    <span>Something went wrong. Please try again.</span>
                    <a className={"text-strong"} href="https://discord.com/channels/" target="_self">Support</a>
                </div>
            </div>
            )
        }
    }

    return (
        <div className={'failure-box'}>
            <div className={'failure-content'}>
                <img className={'pic'} src={failure}/>
                <Content/>
            </div>
        </div>
    );
}

export default Failure;
