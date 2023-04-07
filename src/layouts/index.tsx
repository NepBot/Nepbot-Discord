/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 01:35:14
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 02:35:42
 * @ Description: i@rua.moe
 */

import React from 'react';
import { Outlet } from '@umijs/max';
import styles from './style.less';

const Layout: React.FC = () => {
  const date = new Date().getTime();

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
