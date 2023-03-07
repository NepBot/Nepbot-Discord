/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 23:31:56
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-08 02:55:03
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';

const Background: React.FC = () => {
  return (
    <div className={styles.topBackground}>
      <div className={styles.ellipse1} />
      <div className={styles.ellipse2} />
      <div className={styles.ellipse3} />
      <div className={styles.ellipse4} />
      <div className={styles.ellipse5} />
    </div>
  )
};

export default Background;
