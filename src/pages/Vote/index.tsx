/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-17 18:08:44
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 02:34:45
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import { useLocation, useModel } from "@umijs/max";
import querystring from 'query-string';
import './style.less';
import { RequestTransaction } from "@/utils/contract";
import { API_CONFIG } from "@/constants/config";
import { notification } from "antd";
import UserLayout from "@/layouts/UserLayout";
import Loading from "@/components/Loading";
import LinkExpired from "@/components/LinkExpired";
import Fail from "@/components/Fail";

interface QueryParams {
  contract_address?: string;
  proposal_id?: string;
  action?: string;
}

const Vote: React.FC = () => {
  const { nearAccount, nearWallet, setCallbackUrl } = useModel('near.account');
  const [expiredState, setExpiredState] = useState<boolean>(false);

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!!search?.contract_address && !!search?.proposal_id && !!search.action) {
        if (!nearAccount) {
          return;
        }

        await RequestTransaction({
          nearAccount: nearAccount,
          nearWallet: nearWallet,
          contractId: search.contract_address,
          methodName: 'act_proposal',
          args: {
            id: Number(search.proposal_id),
            action: search.action,
          },
          gas: '300000000000000',
          deposit: '0',
          setCallbackUrl,
          walletCallbackUrl: `${API_CONFIG().ASTRO}/dao/${search?.contract_address}/proposals/${search?.contract_address}-${search?.proposal_id}`,
        });
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
      {!expiredState && (
        <Loading />
      )}
      {expiredState && (
        <LinkExpired />
      )}
    </UserLayout>
  );
};

export default Vote;
