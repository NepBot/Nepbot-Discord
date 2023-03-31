/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 15:53:00
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-31 16:52:16
 * @ Description: i@rua.moe
 */

import { useModel } from '@umijs/max';
import { WaterMark } from '@ant-design/pro-components';
import styles from './style.less';
import { _EXP_DATE } from '@/constants/env';
import { useEffect } from 'react';
import ContentBackground from '@/components/ContentBackground';

const UserLayout = (props: any) => {
  const { walletSelector, nearAccount, nearWallet, OpenModalWallet } = useModel('near.account');

  const date = new Date().getTime();

  useEffect(() => {
    (async () => {
      if (!walletSelector?.isSignedIn()) {
        await OpenModalWallet();
      }
    })()
  }, [walletSelector, nearAccount, nearWallet]);

  return (
    <WaterMark
      content={(date >= _EXP_DATE) ? 'Expired, not safe' : ''}
      fontColor="#ccc"
      zIndex={99999}
      className={styles.watermarkContainer}
    >
      <div className={styles.layoutContainer}>
        <ContentBackground />
        {props.children}
      </div>
    </WaterMark>
  );
}

export default UserLayout;
