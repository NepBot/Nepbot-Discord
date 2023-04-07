/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 15:53:00
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 02:35:49
 * @ Description: i@rua.moe
 */

import { useModel } from '@umijs/max';
import styles from './style.less';
import { useEffect } from 'react';
import ContentBackground from '@/components/ContentBackground';

const UserLayout = (props: any) => {
  const { walletSelector, nearAccount, nearWallet, OpenModalWallet } = useModel('near.account');

  useEffect(() => {
    (async () => {
      if (!walletSelector?.isSignedIn()) {
        await OpenModalWallet();
      }
    })()
  }, [walletSelector, nearAccount, nearWallet]);

  return (
    <div className={styles.layoutContainer}>
      <ContentBackground />
      {props.children}
    </div>
  );
}

export default UserLayout;
