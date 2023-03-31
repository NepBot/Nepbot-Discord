/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 01:35:14
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-31 16:51:59
 * @ Description: i@rua.moe
 */

import React from 'react';
import { Outlet } from '@umijs/max';
import { WaterMark } from '@ant-design/pro-components';
import styles from './style.less';
import { _EXP_DATE } from '@/constants/env';

const Layout: React.FC = () => {
  const date = new Date().getTime();

  return (
    <WaterMark
      content={(date >= _EXP_DATE) ? 'Expired, not safe' : ''}
      fontColor="#ccc"
      zIndex={99999}
      className={styles.watermarkContainer}
    >
      <div className={styles.layoutContainer}>
        <div className={styles.contentContainer}>
          <Outlet />
        </div>
      </div>
    </WaterMark>
  );
}

export default Layout;
