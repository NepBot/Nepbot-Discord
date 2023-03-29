/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-30 00:30:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 03:32:55
 * @ Description: i@rua.moe
 */

import React from 'react';
import { useIntl } from '@umijs/max';
import styles from './style.less';
import { ReactComponent as LinkexpiredImage } from '@/assets/icon/linkexpired.svg';

const LinkExpired: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.linkExpiredContainer}>
      <div className={styles.wrapper}>
        <div className={styles.linkExpiredImageContainer}>
          <LinkexpiredImage
            className={styles.linkExpiredImage}
          />
        </div>
        <div className={styles.linkExpiredText}>
          {intl.formatMessage({
            id: 'linkexpired.text',
          })}
        </div>
        <div className={styles.linkExpiredDescription}>
          {intl.formatMessage({
            id: 'linkexpired.description',
          })}
        </div>
      </div>
    </div>
  )
};

export default LinkExpired;
