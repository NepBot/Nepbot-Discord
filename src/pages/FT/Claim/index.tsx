/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-17 00:37:10
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-18 03:38:07
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import { useModel, useLocation } from "@umijs/max";
import querystring from 'query-string';
import { SignMessage } from "@/utils/near";
import { GetAirdropFTSign } from "@/services/api";
import { notification } from "antd";
import { API_CONFIG } from "@/constants/config";
import { ExecuteMultipleTransactions } from "@/utils/contract";

interface QueryParams {
  user_id?: string;
  guild_id?: string;
  hash?: string;
  sign?: string;
}

const Claim: React.FC = () => {
  const { walletSelector, walletList, activeAccount, nearAccount, OpenModalWallet, setCallbackUrl } = useModel('near.account');
  const [errorState, setErrorState] = useState<boolean>(false);

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!walletSelector?.isSignedIn()) {
        await OpenModalWallet();
      }
    })()
  }, [walletSelector]);

  useEffect(() => {
    (async () => {
      if (!!walletSelector?.isSignedIn() && !!nearAccount && !!search.user_id && !!search.guild_id && !!search.hash && !!search.sign && !!activeAccount) {
        const args = {
          user_id: search.user_id,
          guild_id: search.guild_id,
          hash: search.hash,
          sign: search.sign
        }

        const res = await SignMessage({
          keystore: walletList?.get(activeAccount)?.privateKey!,
          message: JSON.stringify(args),
        })

        const sign = await GetAirdropFTSign({
          args: args,
          account_id: search.user_id,
          sign: res.signature,
        });
        if (!sign || !sign?.data?.success) {
          notification.error({
            message: 'Error',
            description: (sign?.data as Resp.Error)?.message || 'Unknown error',
          });
          setErrorState(true);
          return;
        }

        const campaignInfo = await nearAccount?.viewFunction(
          API_CONFIG().AIRDROP_CONTRACT,
          'get_campaign',
          { hash: search.hash },
        );
        const contractId = campaignInfo?.deposit?.FT?.contract_id;
        const isRegistered = await nearAccount?.viewFunction(
          contractId,
          'storage_balance_of',
          { account_id: activeAccount },
        );

        var txs: any[] = [];
        if (!isRegistered) {
          txs.push({
            receiverId: contractId,
            actions: [{
              methodName: "storage_deposit",
              args: {
                account_id: activeAccount
              },
              deposit: '12500000000000000000000',
              gas: '300000000000000'
            }]
          });
        }

        txs.push({
          receiverId: API_CONFIG().AIRDROP_CONTRACT,
          actions: [{
            methodName: "claim",
            args: {
              hash: search.hash,
              user_id: search.user_id,
              ...sign.data,
            },
            deposit: "0",
            gas: "300000000000000",
          }]
        });
        const result = await ExecuteMultipleTransactions({
          nearAccount: nearAccount,
          transactions: txs,
          setCallbackUrl: setCallbackUrl,
          walletCallbackUrl: `https://discord.com/channels/${search.guild_id}`,
        });

        if (!result) {
          notification.error({
            key: 'error.claim',
            message: 'Error',
            description: 'Claim failed',
          });
          setErrorState(true);
        }

      } else {
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: 'Missing parameters',
        });
        setErrorState(true);
      }
    })()
  }, [walletSelector, walletList, nearAccount, activeAccount, search]);

  return (
    <>
    </>
  );
};

export default Claim;
