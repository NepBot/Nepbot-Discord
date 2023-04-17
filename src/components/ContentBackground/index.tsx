/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-30 03:51:21
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 03:53:10
 * @ Description: 
 */

import React from 'react';
import styles from './style.less';

const ContentBackground: React.FC = () => {
  return (
    <div className={styles.contentBackground}>
      <div className={styles.backgroundLeft} />
      <div className={styles.backgroundRight} />
    </div>
  )
};

export default ContentBackground;
