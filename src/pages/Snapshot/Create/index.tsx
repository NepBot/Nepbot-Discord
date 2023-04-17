/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-20 16:06:26
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 02:26:35
 * @ Description: 
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
import UserLayout from '@/layouts/UserLayout';
import Loading from '@/components/Loading';
import LinkExpired from '@/components/LinkExpired';
import { SignMessage } from '@/utils/near';
import { notification } from 'antd';
import Fail from '@/components/Fail';

interface QueryParams {
  transactionHashes?: string;
  guild_id?: string;
  channel_id?: string;
  user_id?: string;
  contract_address?: string;
  sign?: string;
}

const Create: React.FC = () => {
  const { nearAccount, nearWallet, GetKeyStore } = useModel('near.account');
  const [errorState, setErrorState] = useState<boolean>(false);
  const [expiredState, setExpiredState] = useState<boolean>(false);

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
        hash: Buffer.from((txRes?.status as providers.FinalExecutionStatus)?.SuccessValue!)?.toString('base64')?.replaceAll('\"', ''),
      })
      if (res?.data?.success) {
        window.location.href = `https://discord.com/channels/${search?.guild_id}/${search?.channel_id}`;
      } else {
        notification.error({
          key: 'error.sendMsgSnapshot',
          message: 'Error',
          description: (res.data as Resp.Error)?.message,
        });
        setErrorState(true);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!!search?.transactionHashes) {
        if (!nearAccount) {
          return;
        }

        await checkResult();
        return;
      } else if (!!search?.user_id && !!search?.guild_id && !!search?.contract_address && !!search?.sign) {
        const args = {
          user_id: search?.user_id,
          guild_id: search?.guild_id,
          contract_address: search?.contract_address,
          sign: search?.sign,
        }

        const keystore = await GetKeyStore(nearAccount?.accountId);

        if (!keystore) {
          return;
        };

        const signature = await SignMessage({
          keystore: keystore,
          object: args,
        });

        const _sign = await GetSnapshotSign({
          args: args,
          account_id: nearAccount?.accountId,
          sign: signature?.signature,
        });

        if (!_sign?.data?.success) {
          notification.error({
            key: 'error.getSnapshotSign',
            message: 'Error',
            description: (_sign?.data as Resp.Error)?.message,
          });
          setExpiredState(true);
          return;
        }

        const res = await RequestTransaction({
          nearAccount: nearAccount,
          nearWallet: nearWallet,
          contractId: API_CONFIG().SNAPSHOT_CONTRACT,
          methodName: 'set_snapshot',
          args: {
            contract_address: search.contract_address,
            ...(_sign?.data as Resp.GetSnapshotSign)?.data,
          },
          gas: '300000000000000',
          deposit: '0',
        });

        if (!!res) {
          await checkResult(res as providers.FinalExecutionOutcome);
        }
      } else {
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: 'Missing parameters',
        });
        setExpiredState(true);
      }
    })()
  }, [nearAccount]);

  return (
    <UserLayout>
      {!errorState && !expiredState && (
        <Loading />
      )}
      {errorState && !expiredState && (
        <Fail />
      )}
      {!errorState && expiredState && (
        <LinkExpired />
      )}
    </UserLayout>
  )
};

export default Create;
