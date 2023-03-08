/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 02:53:34
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-08 16:01:09
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import Background from '@/components/TopBackground';

const Connect: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.connectContainer}>
      <Background />
      <div className={styles.wrapper}>
        <div className={styles.windowContainer}>
          <div className={styles.userContainer}>
            <div className={styles.avatar}>
              <img
                src="https://avatars.githubusercontent.com/u/16264281"
                alt=''
                className={styles.avatarImg}
              />
            </div>
            <div className={styles.nickname}>
              Hikaru
            </div>
            <div className={styles.serverName}>
              Server Name
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.button}>
              {intl.formatMessage({
                id: 'connect.button'
              })}
            </div>
            <div className={styles.desc}>
              {intl.formatMessage({
                id: 'connect.button.desc'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Connect;
