import React, { useEffect} from 'react';
import {connect, WalletConnection, keyStores} from "near-api-js";
import WalletSelector from '../../utils/walletSelector';
import {getConfig} from "../../config";
import qs from "qs";
import './Vote.css';
import load from '../../assets/images/load.gif';
import { requestTransaction } from '../../utils/contract';

const config = getConfig()

export default function Success(props) {
    useEffect(()=>{

        (async ()=>{
            const search =  qs.parse(props.location.search.slice(1));
            // const near = await connect(config);
            // const wallet = new WalletConnection(near, 'nepbot');
            // const account = wallet.account(); 

            const walletSelector = await WalletSelector.new({})
            if (!walletSelector.selector.isSignedIn()) {
                const selector = document.getElementById("near-wallet-selector-modal");
                walletSelector.modal.show();
                selector.getElementsByClassName('nws-modal-overlay')[0].style.display= 'none';
                selector.getElementsByClassName('close-button')[0].style.display= 'none';
                return
            }
            const keyStore = new keyStores.InMemoryKeyStore();
            const near = await connect({
                keyStore,
                ...config,
            });
            const account = await near.account();
            
  
            const res = await requestTransaction(
                account,
                search.contract_address,
                "act_proposal",
                {
                    id: Number(search.proposal_id),
                    action:search.action
                },
                '300000000000000',
                '0',
                `${config.ASTRO}/dao/${search.contract_address}/proposals/${search.contract_address}-${search.proposal_id}`
            )
                
        })();
        return ()=>{

        }
    },[props, props.history, props.location.search])

    // const handleDiscord = useCallback(()=>{
    //     window.open('https://discord.com/channels/','_self')
    // },[])

    return (
        <div className={'loading-box'}>
            <div className={'loading-content'}>
                <img src={load}/>
                <div className={'text'}>Loading…</div>
            </div>
        </div>

    );
}
