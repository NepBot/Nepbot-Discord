/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-16 17:16:13
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 02:05:11
 * @ Description: 
 */

import {
  FunctionCallAction,
  Optional,
  Transaction,
  Wallet,
} from '@near-wallet-selector/core';
import { Account } from 'near-api-js';
import { FinalExecutionStatus } from 'near-api-js/lib/providers';

export async function RequestTransaction({
  nearAccount,
  nearWallet,
  contractId,
  methodName,
  args,
  gas = '300000000000000',
  deposit = '0',
  walletCallbackUrl,
  setCallbackUrl,
}: {
  nearAccount?: Account;
  nearWallet?: Wallet;
  contractId?: string;
  methodName: string;
  args?: any;
  gas?: string;
  deposit?: string;
  walletCallbackUrl?: string;
  setCallbackUrl?: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  if (!!walletCallbackUrl) setCallbackUrl?.(walletCallbackUrl);

  const result = await nearWallet?.signAndSendTransaction({
    receiverId: contractId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: methodName,
          args: args,
          gas: gas,
          deposit: deposit,
        },
      },
    ],
    callbackUrl: walletCallbackUrl,
  });

  if (!!result && !!walletCallbackUrl) {
    window.location.href = walletCallbackUrl;
    return true;
  }

  return result;
}

export async function ExecuteMultipleTransactions({
  nearAccount,
  nearWallet,
  transactions,
  walletCallbackUrl,
  setCallbackUrl,
}: {
  nearAccount?: Account;
  transactions?: Array<Optional<Transaction, 'signerId'>>;
  nearWallet?: Wallet;
  walletCallbackUrl?: string;
  setCallbackUrl?: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  if (!!walletCallbackUrl) setCallbackUrl?.(walletCallbackUrl);

  const txs: Array<Optional<Transaction, 'signerId'>> = [];
  transactions?.forEach((tx) => {
    const actions: FunctionCallAction[] = [];
    tx?.actions?.forEach((action: any) => {
      actions.push({
        type: 'FunctionCall',
        params: {
          ...action,
        },
      });
    });
    txs.push({
      receiverId: tx.receiverId,
      actions: actions,
    });
  });

  const result = await nearWallet?.signAndSendTransactions({
    transactions: txs,
    callbackUrl: walletCallbackUrl,
  });

  if (!!result?.length && !!walletCallbackUrl) {
    window.location.href = walletCallbackUrl;
    return true;
  }

  var checkResult: boolean = true;
  result?.forEach((tx) => {
    checkResult = checkResult && !(tx.status as FinalExecutionStatus).Failure;
  });
  return checkResult;
}
