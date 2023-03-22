/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 15:53:00
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-22 23:13:32
 * @ Description: i@rua.moe
 */

import { useModel } from '@umijs/max';
import { WaterMark } from '@ant-design/pro-components';
import styles from './style.less';
import { _EXP_DATE } from '@/constants/env';
import { useEffect, useState } from 'react';

const UserLayout = (props: any) => {
  const { walletSelector, OpenModalWallet } = useModel('near.account');

  const date = new Date().getTime();

  useEffect(() => {
    (async () => {
      if (!walletSelector?.isSignedIn()) {
        await OpenModalWallet();
      }
    })()
  }, [walletSelector]);

  return (
    <WaterMark
      content={(date >= _EXP_DATE) ? '' : 'It has expired, this website is not authorized, please do not do any operation, otherwise there is a risk of funds'}
      fontColor="#ccc"
      zIndex={99999}
      className={styles.watermarkContainer}
    >
      <div className={styles.layoutContainer}>
        {props.children}
      </div>
    </WaterMark>
  );
}

export default UserLayout;
