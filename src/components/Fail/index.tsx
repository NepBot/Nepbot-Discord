/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-30 00:30:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-31 23:39:39
 * @ Description: i@rua.moe
 */

import React from 'react';
import { useIntl } from '@umijs/max';
import styles from './style.less';
import { ReactComponent as FailImage } from '@/assets/icon/fail.svg';

const Fail: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.failContainer}>
      <div className={styles.wrapper}>
        <div className={styles.failImageContainer}>
          <FailImage
            className={styles.failImage}
          />
        </div>
        <div className={styles.failText}>
          {intl.formatMessage({
            id: 'fail.text',
          })}
        </div>
        <div className={styles.failDescription}>
          {intl.formatMessage({
            id: 'fail.description',
          }, {
            support: (
              <b
                className={styles.support}
                onClick={() => {
                  window.open('https://discord.com/channels/', '_blank');
                }}
              >
                Support
              </b>
            )
          })}
        </div>
      </div>
    </div>
  )
};

export default Fail;
