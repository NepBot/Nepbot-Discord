import React, {useCallback, useEffect, useState} from 'react';
import './failure.css';
import failure from '../../assets/images/fail.png';

function Failure(props) {
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
        <div className={'failure-box'}>
            <div className={'failure-content'}>
                <img className={'pic'} src={failure}/>
                <div className={'head'}>Oops!</div>
                <div className={'text'}>
                    Something went wrong.Please try again.
                    <a className={"text-strong"} href="https://discord.com/channels/" target="_self">Support</a>
                </div>
            </div>
        </div>
    );
}

export default Failure;
