/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-16 03:50:36
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-16 03:53:28
 * @ Description: 
 */

import React from 'react';
import styles from './style.less';

const BottomBackground: React.FC = () => {
  return (
    <div className={styles.bottomBackground}>
      <div className={styles.ellipse5} />
      <div className={styles.ellipse4} />
      <div className={styles.ellipse3} />
    </div>
  )
};

export default BottomBackground;
