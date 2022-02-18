import React, {useCallback, useEffect, useState} from 'react';
import {Badge, Button} from 'antd';
import './failure.css';
import bg_left_top from '../../assets/imgs/bg_left_top.svg';
import bg_right_bottom from '../../assets/imgs/bg_right_bottom.svg';
import failure from '../../assets/imgs/failure.svg';

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
            <img className="bg-left-top" src={bg_left_top}/>
            <div className={'failure-content'}>
                <img src={failure}/>
            </div>
            <img className="bg-right-bottom" src={bg_right_bottom}/>
        </div>
    );
}

export default Failure;
