/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 02:13:40
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-16 17:55:52
 * @ Description: i@rua.moe
 */

import { API_CONFIG, WALLETCONNECT_CONFIG } from '@/constants/config';
import { setupCoin98Wallet } from '@near-wallet-selector/coin98-wallet';
import {
  Account,
  setupWalletSelector,
  Wallet,
} from '@near-wallet-selector/core';
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
import { notification } from 'antd';
import { Account as NearAccount, connect, Near } from 'near-api-js';
import { useCallback, useEffect, useState } from 'react';

interface WalletInfo {
  accountId?: string;
  publicKey?: string;
  privateKey?: string | null;
}

export default () => {
  const [walletSelector, setWalletSelector] = useState<WalletSelector>();
  const [modal, setModal] = useState<WalletSelectorModal>();
  const [nearWallet, setNearWallet] = useState<Wallet>();
  const [walletId, setWalletId] = useState<string>();
  const [walletList, setWalletList] = useState<Map<string, WalletInfo>>(
    new Map(),
  );
  const [nearConnection, setNearConnection] = useState<Near>();
  const [nearAccount, setNearAccount] = useState<NearAccount>();
  const [activeAccount, setActiveAccount] = useState<string>();

  const [successUrl, setSuccessUrl] = useState<string>();
  const [callbackUrl, setCallbackUrl] = useState<string>();

  const setLocalWallet = useCallback(
    async ({
      wallet,
      walletId,
      accounts,
    }: {
      wallet?: Wallet;
      walletId?: string;
      accounts: Account[];
    }) => {
      setWalletId(walletId || wallet?.id);
      localStorage.setItem(
        `nepbot:walletId:${API_CONFIG().networkId}`,
        walletId || wallet?.id!,
      );

      if (!!accounts.length) {
        // Set default active account
        walletSelector?.setActiveAccount(accounts[0].accountId);
        setActiveAccount(accounts[0].accountId);

        accounts.forEach((account) => {
          if (!!account.publicKey) {
            setWalletList((walletList) => {
              walletList.set(account.accountId, {
                accountId: account.accountId,
                publicKey: account.publicKey,
              });
              return walletList;
            });

            localStorage.setItem(
              `nepbot:publicKey:${account.accountId}:${API_CONFIG().networkId}`,
              account.publicKey,
            );
            var privateKey: string | null;
            switch (walletId || wallet?.id) {
              case 'meteor-wallet':
                privateKey = localStorage.getItem(
                  `_meteor_wallet${account.accountId}:${
                    API_CONFIG().networkId
                  }`,
                );
                break;
              case 'sender':
                privateKey = `ed25519:${
                  (window?.near as any)?.authData?.accessKey?.secretKey
                }`;
                break;
              default:
                privateKey = localStorage.getItem(
                  `near-api-js:keystore:${account.accountId}:${
                    API_CONFIG().networkId
                  }`,
                );
                break;
            }
            if (!!privateKey) {
              setWalletList((walletList) => {
                walletList.set(account.accountId, {
                  accountId: account.accountId,
                  publicKey: account.publicKey,
                  privateKey,
                });
                return walletList;
              });

              localStorage.setItem(
                `nepbot:keystore:${account.accountId}:${
                  API_CONFIG().networkId
                }`,
                privateKey,
              );
            }
          } else {
            localStorage.clear();
            wallet?.signOut();
            notification.error({
              message: 'Error',
              description: 'Login status has expired, please re-authorize',
            });
          }
        });
      }
    },
    [],
  );

  // Init Wallet Selector
  useEffect(() => {
    setupWalletSelector({
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
          projectId: WALLETCONNECT_CONFIG().projectID,
          metadata: WALLETCONNECT_CONFIG().metadata,
          chainId: WALLETCONNECT_CONFIG().chainsId,
          iconUrl: walletConnectIconUrl,
        }),
        setupNightlyConnect({
          url: 'wss://relay.nightly.app/app',
          appMetadata: {
            additionalInfo: '',
            application: WALLETCONNECT_CONFIG().metadata.name,
            description: WALLETCONNECT_CONFIG().metadata.description,
            icon: WALLETCONNECT_CONFIG().metadata.icons[0],
          },
        }),
      ],
    })
      .then((selector) => {
        setWalletSelector(selector);
      })
      .catch((error) => {
        console.error(error);
        notification.error({
          message: 'Wallet Selector Error',
          description: error.message,
        });
      });
  }, [successUrl, callbackUrl]);

  // Get Wallet Info
  useEffect(() => {
    if (walletSelector?.isSignedIn()) {
      walletSelector?.wallet().then((wallet) => {
        setNearWallet(wallet);

        wallet.getAccounts().then((accounts) => {
          setLocalWallet({ wallet, accounts });
        });
      });
    }
  }, [walletSelector]);

  // Listen Wallet Selector Event
  useEffect(() => {
    if (walletSelector) {
      walletSelector.on('signedIn', (event) => {
        setLocalWallet({
          walletId: event.walletId,
          accounts: event.accounts,
        });
      });

      walletSelector.on('signedOut', (event) => {
        event?.walletId &&
          setWalletList((walletList) => {
            walletList.delete(event.walletId);
            return walletList;
          });
        localStorage.clear();
      });
    }
  }, [walletSelector]);

  // Near Connection
  useEffect(() => {
    (async () => {
      const nearConnection = await connect({
        ...API_CONFIG(),
      });
      setNearConnection(nearConnection);

      if (!!activeAccount) {
        const nearAccount = await nearConnection.account(activeAccount);
        setNearAccount(nearAccount);
      }
    })();
  }, [walletSelector, activeAccount]);

  const OpenModalWallet = useCallback(async () => {
    if (!!walletSelector) {
      const modal = await setupModal(walletSelector, {
        theme: 'dark',
        contractId: API_CONFIG().RULE_CONTRACT!,
      });
      setModal(modal);
      modal.show();
    }
  }, [walletSelector]);

  return {
    modal,
    walletSelector,
    nearWallet,
    walletId,
    walletList,
    nearConnection,
    nearAccount,
    activeAccount,
    OpenModalWallet,
    setSuccessUrl,
    setCallbackUrl,
  };
};
