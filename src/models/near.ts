import { useCallback, useEffect } from 'react';
/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 02:13:40
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-15 18:48:04
 * @ Description: i@rua.moe
 */

import { API_CONFIG } from '@/constants/config';
import { setupCoin98Wallet } from '@near-wallet-selector/coin98-wallet';
import { setupWalletSelector, Wallet } from '@near-wallet-selector/core';
import type { WalletSelector } from '@near-wallet-selector/core/lib/wallet-selector.types';
import { setupFinerWallet } from '@near-wallet-selector/finer-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupMathWallet } from '@near-wallet-selector/math-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import {
  setupModal,
  WalletSelectorModal,
} from '@near-wallet-selector/modal-ui';
import '@near-wallet-selector/modal-ui/styles.css';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNarwallets } from '@near-wallet-selector/narwallets';
import { setupNearSnap } from '@near-wallet-selector/near-snap';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupNearFi } from '@near-wallet-selector/nearfi';
import { setupNeth } from '@near-wallet-selector/neth';
import { setupNightly } from '@near-wallet-selector/nightly';
import { setupNightlyConnect } from '@near-wallet-selector/nightly-connect';
import { setupOptoWallet } from '@near-wallet-selector/opto-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { setupWalletConnect } from '@near-wallet-selector/wallet-connect';
import walletConnectIconUrl from '@near-wallet-selector/wallet-connect/assets/wallet-connect-icon.png';
import { setupWelldoneWallet } from '@near-wallet-selector/welldone-wallet';
import { setupXDEFI } from '@near-wallet-selector/xdefi';
import { useState } from 'react';

export default () => {
  const [walletSelector, setWalletSelector] = useState<WalletSelector>();
  const [modal, setModal] = useState<WalletSelectorModal>();
  const [nearWallet, setNearWallet] = useState<Wallet>();

  useEffect(() => {
    if (walletSelector) {
      walletSelector.on('signedIn', (event) => {
        var accountId;
        switch (event.walletId) {
          case 'sender':
            accountId = event.accounts[0].accountId;
            localStorage.setItem(
              `nepbot:keystore:${accountId}:${API_CONFIG().networkId}`,
              (window as any)?.near?.authData?.accessKey?.secretKey,
            );
            break;
          case 'meteor-wallet':
            accountId = event.accounts[0].accountId;
            const privateKey = localStorage.getItem(
              `_meteor_wallet${accountId}:${API_CONFIG().networkId}`,
            );
            if (!!privateKey) {
              localStorage.setItem(
                `nepbot:keystore:${accountId}:${API_CONFIG().networkId}`,
                privateKey,
              );
            }
            break;
        }
      });
    }
  }, [walletSelector]);

  useEffect(() => {
    if (walletSelector?.isSignedIn()) {
      walletSelector?.wallet().then((wallet) => {
        setNearWallet(wallet);

        console.log('wallet', wallet);

        wallet.getAccounts().then((accounts) => {
          if (accounts.length > 0) {
            accounts.forEach((account) => {
              if (!!account.publicKey) {
                localStorage.setItem(
                  `nepbot:publicKey:${API_CONFIG().networkId}:${
                    account.accountId
                  }`,
                  account.publicKey,
                );
              }
            });
          }
        });

        // localStorage.setItem('nepbot:walletId', wallet.accountId)
      });
    }
  }, [walletSelector]);

  const InitializeWalletConnect = useCallback(async () => {
    const selector = await setupWalletSelector({
      network: 'testnet',
      modules: [
        setupNearWallet(),
        setupMyNearWallet(),
        setupSender(),
        setupHereWallet(),
        setupMathWallet(),
        setupNightly(),
        setupMeteorWallet(),
        setupNearSnap(),
        setupNarwallets(),
        setupWelldoneWallet(),
        setupLedger(),
        setupNearFi(),
        setupCoin98Wallet(),
        setupOptoWallet(),
        setupFinerWallet(),
        setupNeth(),
        setupXDEFI(),
        setupWalletConnect({
          projectId: API_CONFIG().WALLETCONNECT.projectID,
          metadata: API_CONFIG().WALLETCONNECT.metadata,
          chainId: API_CONFIG().WALLETCONNECT.chainsId,
          iconUrl: walletConnectIconUrl,
        }),
        setupNightlyConnect({
          url: 'wss://relay.nightly.app/app',
          appMetadata: {
            additionalInfo: '',
            application: API_CONFIG().WALLETCONNECT.metadata.name,
            description: API_CONFIG().WALLETCONNECT.metadata.description,
            icon: API_CONFIG().WALLETCONNECT.metadata.icons[0],
          },
        }),
      ],
    });
    setWalletSelector(selector);

    const modal = await setupModal(selector, {
      theme: 'dark',
      contractId: API_CONFIG().RULE_CONTRACT!,
    });
    setModal(modal);
    modal.show();
  }, []);

  return {
    modal,
    walletSelector,
    InitializeWalletConnect,
  };
};
