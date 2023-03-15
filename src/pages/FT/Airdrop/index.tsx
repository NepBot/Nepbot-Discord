/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-16 01:18:40
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-16 04:40:58
 * @ Description: i@rua.moe
 */

import React, { useEffect } from "react";
import { useLocation, useModel } from "@umijs/max";
import querystring from 'query-string';
import './style.less';
import { SendFfMsg } from "@/services/api";
import { notification } from "antd";

interface QueryParams {
  guild_id?: string;
  channel_id?: string;
  role_id?: string;
  token_contract?: string;
  total_amount?: string;
  amount_per_share?: string;
  end_time?: string;
  user_id?: string;
}

const Airdrop: React.FC = () => {
  const { walletList, walletSelector, OpenModalWallet } = useModel('near');

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
    }
  };

  useEffect(() => {
    (async () => {
      if (!walletSelector?.isSignedIn()) {
        await OpenModalWallet();
      }
    })()
  }, [walletSelector]);

  return (
    <></>
  )
};

export default Airdrop;
