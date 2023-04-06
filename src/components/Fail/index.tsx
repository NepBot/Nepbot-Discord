/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-30 00:30:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-07 03:27:34
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from '@umijs/max';
import styles from './style.less';
import { ReactComponent as FailImage } from '@/assets/icon/fail.svg';
import { API_CONFIG } from '@/constants/config';

const Fail: React.FC<{
  from?: string;
  status?: number;
}> = ({ from, status }) => {
  const { nearAccount } = useModel('near.account');
  const [info, setInfo] = useState<any>();
  const [title, setTitle] = useState<any>();

  const intl = useIntl();

  useEffect(() => {
    (async () => {
      switch (from) {
        case 'twitter_verify':
          if (status === 1) {
            setTitle(intl.formatMessage({
              id: 'fail.title.twitter_verify',
            }));
            setInfo(localStorage.getItem(`nepbot:twitter:verify:${nearAccount?.accountId}:${API_CONFIG().networkId}`) || '');
            localStorage.removeItem(`nepbot:twitter:verify:${nearAccount?.accountId}:${API_CONFIG().networkId}`);
          } else {
            setTitle(intl.formatMessage({
              id: 'fail.title.default',
            }))
            setInfo(intl.formatMessage({
              id: 'fail.description.default',
            }, {
              support: (
                <b
                  onClick={() => {
                    window.open('https://discord.com/channels/', '_blank');
                  }}
                >
                  Support
                </b>
              )
            }))
          }
          break;
        case 'airdrop':
          setTitle(intl.formatMessage({
            id: 'fail.title.airdrop',
          }));
          setInfo(intl.formatMessage({
            id: 'fail.description.airdrop',
          }, {
            support: (
              <b
                onClick={() => {
                  window.open('https://discord.com/channels/', '_blank');
                }}
              >
                Support
              </b>
            )
          }));
          break;
        default:
          setTitle(intl.formatMessage({
            id: 'fail.title.default',
          }))
          setInfo(intl.formatMessage({
            id: 'fail.description.default',
          }, {
            support: (
              <b
                onClick={() => {
                  window.open('https://discord.com/channels/', '_blank');
                }}
              >
                Support
              </b>
            )
          }))
          break;
      }
    })()
  }, []);

  return (
    <div className={styles.failContainer}>
      <div className={styles.wrapper}>
        <div className={styles.failImageContainer}>
          <FailImage
            className={styles.failImage}
          />
        </div>
        <div className={styles.failText}>
          {title}
        </div>
        <div className={styles.failDescription}>
          {from === 'twitter_verify' && status === 1 ? (
            <div dangerouslySetInnerHTML={{ __html: info }} />
          ) : info}
        </div>
      </div>
    </div>
  )
};

export default Fail;
