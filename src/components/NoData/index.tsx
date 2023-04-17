/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-30 00:30:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 03:45:38
 * @ Description: 
 */

import React from 'react';
import { useIntl } from '@umijs/max';
import styles from './style.less';
import { ReactComponent as NoDataImage } from '@/assets/icon/nodata.svg';

const NoData: React.FC<{
  name: string;
}> = ({ name }) => {
  const intl = useIntl();

  return (
    <div className={styles.nodataContainer}>
      <div className={styles.wrapper}>
        <div className={styles.nodataImageContainer}>
          <NoDataImage
            className={styles.nodataImage}
          />
        </div>
        <div className={styles.nodataText}>
          {intl.formatMessage({
            id: 'nodata.text',
          }, {
            name: name,
          })}
        </div>
      </div>
    </div>
  )
};

export default NoData;
