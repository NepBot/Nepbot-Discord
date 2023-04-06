/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-30 00:30:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-07 03:27:27
 * @ Description: i@rua.moe
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { useIntl, useModel } from '@umijs/max';
import styles from './style.less';
import { ReactComponent as SuccessImage } from '@/assets/icon/success.svg';
import { API_CONFIG } from '@/constants/config';

const Success: React.FC<{
  from?: string,
  contract_type?: string,
}> = ({ from, contract_type }) => {
  const { nearAccount } = useModel('near.account');
  const [info, setInfo] = useState<any>();
  const [title, setTitle] = useState<any>();

  const intl = useIntl();

  useEffect(() => {
    (async () => {
      switch (from) {
        case 'twitter_verify':
          setTitle(intl.formatMessage({
            id: 'success.title.twitter_verify',
          }));
          setInfo(localStorage.getItem(`nepbot:twitter:verify:${nearAccount?.accountId}:${API_CONFIG().networkId}`) || '');
          localStorage.removeItem(`nepbot:twitter:verify:${nearAccount?.accountId}:${API_CONFIG().networkId}`);
          break;
        case 'mint':
          setTitle(intl.formatMessage({
            id: 'success.title.mint',
          }));
          setInfo(intl.formatMessage({
            id: 'success.description.mint',
          }, {
            type: <b>{!!contract_type ? contract_type : 'Paras'}</b>
          }));
          break;
        default:
          setTitle(intl.formatMessage({
            id: 'success.title.default',
          }));
          setInfo(intl.formatMessage({
            id: 'success.description.default',
          }));
          setTimeout(async () => {
            window.location.href = "https://discord.com/channels/"
          }, 5000);
          break;
      }
    })();
  }, []);

  return (
    <div className={styles.successContainer}>
      <div className={styles.wrapper}>
        <div className={styles.successImageContainer}>
          <SuccessImage
            className={styles.successImage}
          />
        </div>
        <div className={styles.successText}>
          {title}
        </div>
        <div className={styles.successDescription}>
          {from === 'twitter_verify' ? (
            <div dangerouslySetInnerHTML={{ __html: info }} />
          ) : info}
        </div>
      </div>
    </div>
  )
};

export default Success;
