import React, {useCallback, useEffect, useState} from 'react';
import './failure.css';
import failure from '../../assets/images/fail.png';

function Failure(props) {
    return (
        <div className={'failure-box'}>
            <div className={'failure-content'}>
                <img className={'pic'} src={failure}/>
                <div className={'head'}>Oops!</div>
                <div className={'text'}>
                    Something went wrong. Please try again.
                    <a className={"text-strong"} href="https://discord.com/channels/" target="_self">Support</a>
                </div>
            </div>
        </div>
    );
}

export default Failure;
