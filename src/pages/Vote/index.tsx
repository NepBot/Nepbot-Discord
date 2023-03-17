/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-17 18:08:44
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-18 04:26:32
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import { useLocation, useModel } from "@umijs/max";
import querystring from 'query-string';
import './style.less';
import { RequestTransaction } from "@/utils/contract";
import { API_CONFIG } from "@/constants/config";
import { notification } from "antd";

interface QueryParams {
  contract_address?: string;
  proposal_id?: string;
  action?: string;
}

const Vote: React.FC = () => {
  const { walletSelector, nearAccount, OpenModalWallet, setCallbackUrl } = useModel('near.account');
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
      if (!!walletSelector?.isSignedIn() && !!nearAccount && !!search?.contract_address && !!search?.proposal_id && !!search.action) {
        const res = await RequestTransaction({
          nearAccount: nearAccount,
          contractId: search.contract_address,
          methodName: 'act_proposal',
          args: {
            id: search.proposal_id,
            action: search.action,
          },
          gas: '300000000000000',
          deposit: '0',
          setCallbackUrl,
          walletCallbackUrl: `${API_CONFIG().ASTRO}/dao/${search?.contract_address}/proposals/${search?.contract_address}-${search?.proposal_id}`,
        });

        if (!res) {
          notification.error({
            key: 'error.params',
            message: 'Error',
            description: 'Vote failed',
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
  }, [walletSelector, nearAccount, search]);

  return (
    <></>
  );
};

export default Vote;
