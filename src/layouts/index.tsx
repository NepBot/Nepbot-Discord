/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 01:35:14
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-08 18:11:36
 * @ Description: i@rua.moe
 */

import React from 'react';
import { Link, Outlet } from '@umijs/max';
import { WaterMark } from '@ant-design/pro-components';
import styles from './index.less';
import { expDate } from '@/constants/config';
import Header from '@/components/Header';

const Layout: React.FC = () => {
  const date = new Date().getTime();

  return (
    <WaterMark
      content={(date >= expDate) ? '' : 'It has expired, this website is not authorized, please do not do any operation, otherwise there is a risk of funds'}
      fontColor="#ccc"
      zIndex={99999}
      className={styles.watermarkContainer}
    >
      <div className={styles.layoutContainer}>
        <Header />
        <div className={styles.contentContainer}>
          <Outlet />
        </div>
      </div>
    </WaterMark>
  );
}

export default Layout;
