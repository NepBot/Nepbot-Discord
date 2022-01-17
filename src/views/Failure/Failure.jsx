import React, {useCallback, useEffect, useState} from 'react';
import {Badge, Button} from 'antd';
import './failure.css';
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

    const handleBack = useCallback(()=>{
        props.history.replace('/');
    },[props.history])

    const handleDiscord = useCallback(()=>{
        window.open('https://discord.com/channels/','_self')
    },[])
    return (
        <div className={'fail_content'}>
            <p>Authorization failed {<Badge count={countdown} />} s and then return to discord, you can click the back button to re-authorize, or open discord directly</p>
            <Button type={'primary'} size={'large'} onClick={handleBack}>back</Button>
            <Button type={'link'} size={'large'} plain onClick={handleDiscord}>discord</Button>
        </div>
    );
}

export default Failure;
