/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-17 04:09:10
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-17 04:20:00
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import { useModel, useLocation } from "@umijs/max";
import querystring from 'query-string';
import { RequestTransaction } from "@/utils/contract";
import { API_CONFIG } from "@/constants/config";
import { notification } from "antd";

interface QueryParams {
  hash?: string;
}

const Redeem: React.FC = () => {
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
      if (!!search.hash && !!activeAccount) {
        const res = await RequestTransaction({
          nearAccount: nearAccount,
          contractId: API_CONFIG().AIRDROP_CONTRACT,
          methodName: 'redeem',
          args: {
            hash: search?.hash
          },
          gas: '300000000000000',
          deposit: '0',
          setCallbackUrl,
          walletCallbackUrl: 'https://discord.com/channels/',
        });

        if (!res) {
          notification.error({
            message: 'Error',
            description: 'Redeem failed.',
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
    <></>
  )
};

export default Redeem;
