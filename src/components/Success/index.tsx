/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-30 00:30:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 03:37:19
 * @ Description: i@rua.moe
 */

import React from 'react';
import { useIntl } from '@umijs/max';
import styles from './style.less';
import { ReactComponent as SuccessImage } from '@/assets/icon/success.svg';

const Success: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.successContainer}>
      <div className={styles.wrapper}>
        <div className={styles.successImageContainer}>
          <SuccessImage
            className={styles.successImage}
          />
        </div>
        <div className={styles.successText}>
          {intl.formatMessage({
            id: 'success.text',
          })}
        </div>
        <div className={styles.successDescription}>
          {intl.formatMessage({
            id: 'success.description.nft',
          }, {
            type: <b>Paras</b>
          })}
        </div>
      </div>
    </div>
  )
};

export default Success;
