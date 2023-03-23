/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-18 03:42:43
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-24 02:45:23
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import { useLocation, useModel } from "@umijs/max";
import querystring from 'query-string';
import './style.less';
import { TwitterVerify } from "@/services/api";
import { API_CONFIG } from "@/constants/config";
import { notification } from "antd";
import UserLayout from "@/layouts/UserLayout";

interface QueryParams {
  state?: string;
  code?: string;
}

const Verify: React.FC = () => {
  const { walletSelector, nearAccount, OpenModalWallet } = useModel('near.account');
  const [errorState, setErrorState] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<boolean>(false);

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!!walletSelector?.isSignedIn() && !!nearAccount && !!search.code && !!search.state) {
        const res = await TwitterVerify({
          code: search.code,
          state: search.state,
        });

        if (typeof res.data === "object" && !!res.data) {
          var info: string = "";

          const data = res?.data as Resp.TwitterVerify[];

          if (data[0]['name'] === 'Add role success' || data[0]['name'] == 'Already in role') {
            localStorage.setItem(`nepbot:twitter:verify:${nearAccount.accountId}:${API_CONFIG().networkId}`, data[0]['value']!);
            setSuccessState(true);
          } else {
            data.forEach((item) => {
              if (!!item?.value && item?.value?.indexOf('https://') > -1) {
                const infoArr = item?.value?.split('https://');
                const url = `https://${infoArr[1]}`
                if (infoArr[0].indexOf('Must:') > -1) {
                  const textArr = infoArr[0].split('Must:');
                  info += `${textArr[0]} <br/> Must:${textArr[1]} <a href="${url}" target="_blank">${url}</a> <br/><br/>`;
                } else {
                  info += `${infoArr[0]} <a href="${url}" target="_blank">${url}</a> <br/><br/>`
                }
              } else {
                if (!!item?.value && item?.value?.indexOf('Must:') > -1) {
                  const textArr = item?.value?.split("Must:");
                  info += `${textArr[0]} <br/> Must:${textArr[1]} <br/><br/>`
                } else {
                  info += `${item?.value} <br/><br/>`
                }
              }
            });
            localStorage.setItem(`nepbot:twitter:verify:${nearAccount.accountId}:${API_CONFIG().networkId}`, info);
            setErrorState(true);
          }
        } else {
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
    <UserLayout>

    </UserLayout>
  )
};

export default Verify;
