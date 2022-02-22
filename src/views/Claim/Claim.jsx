/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Row, Col, Input, Button, List} from 'antd';
import {connect, WalletConnection, keyStores, KeyPair} from "near-api-js";
import {config} from '../../config';
import './Claim.css';
import store from "../../store/discordInfo";

export default function Index(props) {
    const [text, setText] = useState("LOADING...")
    useEffect(() => {
        (async () => {
            const near = await connect(config);
            const wallet = new WalletConnection(near, 'nepbot');
            if (!wallet.isSignedIn()) {
                wallet.requestSignIn(config.RULE_CONTRACT, "nepbot")
                return
            }
            
            const generatedKeyPair = {
                secretKey: "ed25519:29LRNqZwgPW7VcqAjKP77ae2GjXHNFWch6mMqSXSVKFqTpXdEM4cC1TRQuWnozxTk2bcyrshdZeWK34zRY2Uj8jf",
                publicKey: "ed25519:4nukWp3wZonCCHVF1qN3UssNTkxkkjRpsJVuSEoAUV5f"
            }
            const keyStore = new keyStores.InMemoryKeyStore();
            const keyPair = KeyPair.fromString(generatedKeyPair.secretKey)

            await keyStore.setKey(config.networkId, config.LINKDROP, keyPair);
            const nearClaim = await connect({
                keyStore: keyStore,
                networkId: config.networkId,
                nodeUrl: config.nodeUrl,
                walletUrl: config.walletUrl,
                helperUrl: config.helperUrl,
                explorerUrl: config.explorerUrl
            });

            let account = await nearClaim.account(config.LINKDROP);
            try {
                await account.functionCall({
                    contractId: config.LINKDROP,
                    methodName: "claim", 
                    args: {public_key: generatedKeyPair.publicKey, receiver: wallet.getAccountId()}, 
                    gas: "100000000000000"
                })
                setText("SUCCESS")
            } catch (e) {
                setText("FAILED")
            }
            
            
        })();
        return () => {
        }
    }, []);


    return (
        <div className={"claim-wrap"}>
            {text}
            
        </div>
    )
}
