/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-20 16:06:26
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-21 21:49:22
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from 'react';
import { useModel, useLocation } from '@umijs/max';
import querystring from 'query-string';
import './style.less';
import { providers } from 'near-api-js';
import { API_CONFIG } from '@/constants/config';
import { GetSnapshotSign, SendMsgSnapshot } from '@/services/api';
import { base58 } from 'ethers/lib/utils';
import { RequestTransaction } from '@/utils/contract';

interface QueryParams {
  transactionHashes?: string;
  guild_id?: string;
  channel_id?: string;
  user_id?: string;
  contract_address?: string;
  sign?: string;
}

const Create: React.FC = () => {
  const { walletSelector, nearAccount, OpenModalWallet, setCallbackUrl } = useModel('near.account');
  const [errorState, setErrorState] = useState<boolean>(false);

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  const checkResult = async (result?: providers.FinalExecutionOutcome) => {
    if (!!nearAccount?.accountId) {
      const provider = new providers.JsonRpcProvider({
        url: API_CONFIG().nodeUrl,
      });
      const txRes = !!search?.transactionHashes ? await provider.txStatus(search?.transactionHashes, nearAccount?.accountId) : result;
      const res = await SendMsgSnapshot({
        guild_id: search?.guild_id,
        channel_id: search?.channel_id,
        hash: Buffer.from((txRes?.status as providers.FinalExecutionStatus)?.SuccessValue!).toString('base64').replaceAll('\"', ''),
      })
      if (res?.response?.status === 200 && res?.data?.success) {
        window.location.href = `https://discord.com/channels/${search?.guild_id}/${search?.channel_id}`;
      } else {
        setErrorState(true);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!walletSelector?.isSignedIn()) {
        await OpenModalWallet();
      }
    })()
  }, [walletSelector]);

  useEffect(() => {
    (async () => {
      if (!!walletSelector?.isSignedIn() && !!nearAccount) {
        if (!!search?.transactionHashes) {
          await checkResult();
          return;
        } else if (!!search?.user_id && !!search?.guild_id && !!search?.contract_address && !!search?.sign) {
          const args = {
            user_id: search?.user_id,
            guild_id: search?.guild_id,
            contract_address: search?.contract_address,
            sign: search?.sign,
          }
          const signature = await nearAccount?.connection.signer.signMessage(Buffer.from(JSON.stringify(args)), nearAccount?.accountId, API_CONFIG().networkId);
          const sign = await GetSnapshotSign({
            args: args,
            account_id: nearAccount?.accountId,
            sign: base58.encode(signature.signature),
          });

          if (sign?.response?.status !== 200 || !sign?.data?.success) {
            setErrorState(true);
            return;
          }

          const res = await RequestTransaction({
            nearAccount: nearAccount,
            contractId: API_CONFIG().SNAPSHOT_CONTRACT,
            methodName: 'set_snapshot',
            args: {
              contract_address: search.contract_address,
              ...sign
            },
            gas: '300000000000000',
            deposit: '0',
          });

          if (!!res) {
            await checkResult(res as providers.FinalExecutionOutcome);
          }
        }
      }
    })()
  }, [walletSelector, nearAccount, search]);

  return (
    <></>
  )
};

export default Create;
