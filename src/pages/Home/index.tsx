/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 23:15:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-13 04:17:12
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl } from '@umijs/max';
import TopBackground from './components/TopBackground';
import { ReactComponent as RightArrow } from '@/assets/icon/right-arrow.svg';
import { ReactComponent as NearLogoWhite } from '@/assets/brand/near_logo_wht.svg';
import { ReactComponent as PopulaLogoWhite } from '@/assets/brand/popula_logo_wht.svg'

const Home: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.screen1}>
        <TopBackground />
        <div className={styles.screen1Content}>
          <div className={styles.screen1Title}>
            {intl.formatMessage({
              id: 'home.screen1.title'
            })}
          </div>
          <div className={styles.screen1Desc}>
            {intl.formatMessage({
              id: 'home.screen1.desc'
            }, {
              discord: <span className={styles.screen1DescBold}>Discord</span>,
              account: <span className={styles.screen1DescLink}>@NearProtocol</span>,
            })}
          </div>
          <div className={styles.screen1Button}>
            <div className={styles.screen1ButtonLeft}>
              {intl.formatMessage({
                id: 'home.screen1.button.getStarted'
              })}
            </div>
            <div className={styles.screen1ButtonRight}>
              <RightArrow />
            </div>
          </div>
        </div>
        <div className={styles.screen1Bar}>
          <div className={styles.screen1BarItem}>
            {intl.formatMessage({
              id: 'home.screen1.bar.poweredBy'
            })}
            <NearLogoWhite
              className={styles.screen1BarItemIcon}
            />
          </div>
          <div className={styles.screen1BarItem}>
            {intl.formatMessage({
              id: 'home.screen1.bar.backedBy'
            })}
            <PopulaLogoWhite
              className={styles.screen1BarItemIcon}
            />
          </div>
        </div>
      </div>
      <div className={styles.screen2}>
        <div className={styles.screen2Content}>
          <div className={styles.screen2Left}>
            <div className={styles.screen2LeftTitle}>
              {intl.formatMessage({
                id: 'home.screen2.title'
              })}
            </div>
            <div className={styles.screen2LeftDesc}>
              {intl.formatMessage({
                id: 'home.screen2.desc'
              })}
            </div>
            <div className={styles.screen2LeftButton}>
              {intl.formatMessage({
                id: 'home.screen2.button'
              })}
            </div>
          </div>
          <div className={styles.screen2Right}>
            <div className={styles.screen2RightItem}>
              <div className={styles.screen2RightItemContent}>
                <div className={styles.screen2RightItemContentTitle}>
                  Special Support
                </div>
                <div className={styles.screen2RightItemContentDesc}>
                  Verify on-chain assets and status on NEAR Blockchain, including
                </div>
                <div className={styles.screen2RightItemContentList}>
                  <ul>
                    <li>Paras Loyalty Progra</li>
                    <li>Castle Overlord Whitelist</li>
                    <li>verification</li>
                    <li>vSelf verification</li>
                  </ul>
                </div>
              </div>
              <div className={styles.screen2RightItemIcon}>
                <img
                  src={require('@/assets/ic/ic-DAOVote.webp')}
                  alt="DAO Vote"
                  className={styles.screen2RightItemIconImg}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Home;
