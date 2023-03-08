/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:32:23
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-09 03:43:45
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';

const Item: React.FC<{
  icon: string;
  name: string;
  desc: string;
}> = ({ icon, name, desc }) => {
  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemIcon}>
        <img
          src={icon}
          alt={name}
          className={styles.itemImg}
        />
      </div>
      <div className={styles.itemName}>
        {name}
      </div>
      <div className={styles.itemDesc}>
        {desc}
      </div>
    </div>
  )
};

export default Item;
