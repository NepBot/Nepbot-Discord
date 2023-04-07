/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-18 03:42:43
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 02:31:38
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
import Loading from "@/components/Loading";
import Success from "@/components/Success";
import Fail from "@/components/Fail";
import LinkExpired from "@/components/LinkExpired";

interface QueryParams {
  state?: string;
  code?: string;
}

const Verify: React.FC = () => {
  const { nearAccount } = useModel('near.account');
  const [errorState, setErrorState] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<boolean>(false);
  const [expiredState, setExpiredState] = useState<boolean>(false);
  const [status, setStatus] = useState<number>();

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!!search.code && !!search.state) {
        if (!nearAccount) {
          return;
        }

        const res = await TwitterVerify({
          code: search?.code,
          state: search?.state,
        });

        if (typeof res.data === "object" && !!res.data) {
          var info: string = "";

          const data = res?.data as Resp.TwitterVerify[];

          if (data[0]['name'] === 'Add role success' || data[0]['name'] == 'Already in role') {
            localStorage.setItem(`nepbot:twitter:verify:${nearAccount?.accountId}:${API_CONFIG().networkId}`, data[0]['value']!);
            setSuccessState(true);
            return;
          } else {
            data.forEach((item) => {
              if (!!item?.value && item?.value?.indexOf('https://') > -1) {
                const infoArr = item?.value?.split('https://');
                const url = `https://${infoArr[1]}`
                if (infoArr[0]?.indexOf('Must:') > -1) {
                  const textArr = infoArr[0]?.split('Must:');
                  info += `${textArr[0]} <br/> Must:${textArr[1]} <a href="${url}" target="_blank">${url}</a> <br/><br/>`
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
            localStorage.setItem(`nepbot:twitter:verify:${nearAccount?.accountId}:${API_CONFIG().networkId}`, info);
            setErrorState(true);
            setStatus(1);
            return;
          }
        } else {
          setErrorState(true);
          setStatus(0);
          return;
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
      {!errorState && !expiredState && !successState && (
        <Loading />
      )}
      {errorState && !expiredState && !successState && (
        <Fail
          from='twitter_verify'
          status={status}
        />
      )}
      {!errorState && !expiredState && successState && (
        <Success
          from='twitter_verify'
        />
      )}
      {!errorState && expiredState && !successState && (
        <LinkExpired />
      )}
    </UserLayout>
  )
};

export default Verify;
