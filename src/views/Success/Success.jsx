import React from 'react';
import './success.css';
import success from '../../assets/images/icon-success.png';

function Success(props) {
    
    return (
        <div className={'success-box'}>
            <div className={'success-content'}>
                <img className={'pic'} src={success}/>
                <div className={'head'}>Well done!</div>
                <div className={'text'}>
                    Wallet is connected.<br/>
                    Please go back to Discord and check your roles! :)
                </div>
            </div>
        </div>
    );
}

export default  Success;
