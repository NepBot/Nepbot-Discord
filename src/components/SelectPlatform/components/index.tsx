/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:32:23
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-22 22:12:01
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';

const Item: React.FC<{
  Icon: string | React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }>;
  name: string;
  desc: string;
  onClick?: () => void;
}> = ({ Icon, name, desc, onClick }) => {
  return (
    <div
      className={styles.itemContainer}
      onClick={onClick}
    >
      <div className={styles.itemIcon}>
        {typeof Icon === 'string' ? (
          <img
            src={Icon?.toString()}
            alt={name}
            className={styles.itemImg}
          />
        ) : <Icon className={styles.itemImg} />}
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
