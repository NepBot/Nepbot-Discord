/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 02:53:11
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-08 03:15:18
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { history, useIntl } from '@umijs/max';

const Header: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.wrapper}>
        <div className={styles.logoContainer}>
          <Logo
            className={styles.logoImage}
            onClick={() => {
              history.push('/');
            }}
          />
        </div>
        <div className={styles.navContainer}>
          <a
            className={styles.navItem}
            onClick={() => {
              history.push('/');
            }}
          >

          </a>
        </div>
      </div>
    </div>
  )
}

export default Header;