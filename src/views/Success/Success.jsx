import React, {useCallback, useEffect, useState} from 'react';
import './success.css';
import success from '../../assets/images/icon-success.png';

function Success(props) {
    const [countdown,setCountdown] = useState(10);
    useEffect(()=>{
        const timer = setInterval(()=>{
            if(countdown === 0) {
                window.open('https://discord.com/channels/','_self')
            }
            setCountdown(countdown-1)
        },1000);
        return ()=>{
            clearInterval(timer)
        }
    },[countdown])
    return (
        <div className={'success-box'}>
            <div className={'success-content'}>
                <img className={'pic'} src={success}/>
                <div className={'head'}>Well done!</div>
                <div className={'text'}>
                    Wallet is connected.<br/>
                    Please go back to Discord and check your roles! :)
                    {/* <a className={"text-strong"} href="https://discord.com/channels/" target="_self">Support</a> */}
                </div>
            </div>
        </div>
    );
}

export default  Success;
