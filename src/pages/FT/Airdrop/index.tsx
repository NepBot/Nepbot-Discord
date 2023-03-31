/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-16 01:18:40
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-01 03:25:21
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import { useLocation, useModel } from "@umijs/max";
import querystring from 'query-string';
import './style.less';
import { SendFfMsg } from "@/services/api";
import { notification } from "antd";
import { base58, sha256 } from "ethers/lib/utils";
import { ParseAmount } from "@/utils/near";
import { API_CONFIG } from "@/constants/config";
import { ExecuteMultipleTransactions } from "@/utils/contract";
import UserLayout from "@/layouts/UserLayout";
import Loading from "@/components/Loading";
import LinkExpired from "@/components/LinkExpired";

interface QueryParams {
  guild_id?: string;
  channel_id?: string;
  role_id?: string;
  token_contract?: string;
  total_amount?: string;
  amount_per_share?: string;
  end_time?: string;
  user_id?: string;
  transactionHashes?: string;
}

const Airdrop: React.FC = () => {
  const { walletSelector, nearAccount, nearWallet } = useModel('near.account');
  const [errorState, setErrorState] = useState<boolean>(false);

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);
  const airdropHash = localStorage.getItem(`nepbot:airdrop:${search?.user_id}`)

  const checkResult = async () => {
    if (!!airdropHash && !!search?.guild_id && !!search?.channel_id && !!search?.role_id && !!search?.token_contract && !!search?.total_amount && !!search?.amount_per_share && !!search?.end_time) {
      const res = await SendFfMsg({
        guild_id: search.guild_id,
        channel_id: search.channel_id,
        role_id: search.role_id,
        token_contract: search.token_contract,
        total_amount: search.total_amount,
        amount_per_share: search.amount_per_share,
        end_time: search.end_time,
        hash: airdropHash,
      })

      if (res?.response?.status === 200 && res?.data?.success) {
        window.location.href = `https://discord.com/channels/${search.guild_id}/${search.channel_id}`;
      } else {
        notification.error({
          message: 'Error',
          description: (res?.data as Resp.Error)?.message || 'Unknown error',
        });
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'Missing parameters',
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (!nearAccount || !nearWallet || !walletSelector) {
        return;
      }

      if (!!search?.transactionHashes) {
        await checkResult();
      } else if (!!search?.token_contract) {
        const metadata = await nearAccount?.viewFunction(search?.token_contract, 'ft_metadata', {});

        if (!!search?.amount_per_share && !!search?.total_amount && !!search?.end_time && !!search?.guild_id && !!search?.role_id && !!metadata) {
          const args = {
            claim_amount: ParseAmount({
              amount: search?.amount_per_share,
              decimals: metadata?.decimals,
            }),
            deposit: {
              FT: [search?.token_contract, ParseAmount({
                amount: search?.total_amount,
                decimals: metadata?.decimals,
              })]
            },
            end_time: String(new Date(search?.end_time)?.getTime() * 1000000),
            guild_id: search?.guild_id,
            role_ids: [search?.role_id],
            start_time: String(new Date().getTime() * 1000000),
          }
          const hash = base58.encode(sha256(Buffer.from(JSON.stringify(args))));
          localStorage.setItem(`nepbot:airdrop:${search?.user_id}`, hash);

          const isRegistered = await nearAccount?.viewFunction(search?.token_contract, 'storage_balance_of', { account_id: API_CONFIG()?.AIRDROP_CONTRACT });

          var txs: any[] = [];
          if (!isRegistered) {
            txs = [{
              receiverId: search?.token_contract,
              actions: [{
                methodName: "storage_deposit",
                args: {
                  account_id: API_CONFIG()?.AIRDROP_CONTRACT
                },
                deposit: '12500000000000000000000',
                gas: '300000000000000'
              }]
            }]
          }

          txs.push({
            receiverId: API_CONFIG()?.AIRDROP_CONTRACT,
            actions: [{
              methodName: "add_campaign",
              args: {
                campaign: args
              },
              deposit: "8000000000000000000000",
              gas: "100000000000000",
              // kind: "functionCall",
            }]
          });

          txs.push({
            receiverId: search?.token_contract,
            actions: [{
              args: {
                receiver_id: API_CONFIG()?.AIRDROP_CONTRACT,
                amount: ParseAmount({
                  amount: search?.total_amount,
                  decimals: metadata?.decimals,
                }),
                msg: hash
              },
              deposit: "1",
              gas: "100000000000000",
              methodName: "ft_transfer_call"
              // kind: "functionCall",
            }]
          });

          const result = await ExecuteMultipleTransactions({
            nearAccount,
            nearWallet,
            transactions: txs,
          });

          if (!!result) {
            await checkResult();
          }
        } else {
          notification.error({
            key: 'error.params',
            message: 'Error',
            description: 'Missing parameters',
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
  }, [walletSelector, nearAccount, nearWallet, search]);

  return (
    <UserLayout>
      {!errorState && (
        <Loading />
      )}
      {errorState && (
        <LinkExpired />
      )}
    </UserLayout>
  )
};

export default Airdrop;
