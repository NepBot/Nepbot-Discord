/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-30 00:37:32
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 03:28:54
 * @ Description: i@rua.moe
 */

import React from "react";
import { useIntl } from '@umijs/max';
import styles from './style.less';
import { ReactComponent as LoadingImage } from '@/assets/icon/loading.svg';

const Loading: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.wrapper}>
        <div className={styles.loadingImageContainer}>
          <div className={styles.eyesAnimation}>
            <div className={styles.eyeLeft} />
            <div className={styles.eyeRight} />
          </div>
          <LoadingImage
            className={styles.loadingImage}
          />
        </div>
        <div className={styles.loadingText}>
          {intl.formatMessage({
            id: 'loading.text'
          })}
        </div>
      </div>
    </div>
  )
}

export default Loading;
