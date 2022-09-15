import React, {useCallback, useEffect, useState} from 'react';
import './failure.css';
import failure from '../../assets/images/fail.png';
import qs from "qs";



function Failure(props) {
    const [type, setType] = useState('');
    useEffect(()=>{
        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            if(search.from){
                setType(search.from);
            }
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    function Tip(){
        if(type === 'airdrop'){
            return (<span>Something went wrong. Please check the transaction on Near Explorer.</span>)
        }else{
            return (<span>Something went wrong. Please try again.</span>)
        }
    }

    return (
        <div className={'failure-box'}>
            <div className={'failure-content'}>
                <img className={'pic'} src={failure}/>
                <div className={'head'}>Oops!</div>
                <div className={'text'}>
                    <Tip/>
                    <a className={"text-strong"} href="https://discord.com/channels/" target="_self">Support</a>
                </div>
            </div>
        </div>
    );
}

export default Failure;
