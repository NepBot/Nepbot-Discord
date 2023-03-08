/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 23:15:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-08 16:00:26
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl } from '@umijs/max';
import TopBackground from '@/components/TopBackground';
import { ReactComponent as RightArrow } from '@/assets/icon/right-arrow.svg';
import { ReactComponent as NearLogoWhite } from '@/assets/brand/near_logo_wht.svg';
import { ReactComponent as PopulaLogoWhite } from '@/assets/brand/popula_logo_wht.svg';
import { ReactComponent as Safe } from '@/assets/icon/ic-Safe.svg';
import { ReactComponent as Fast } from '@/assets/icon/ic-Fast.svg';
import { ReactComponent as Free } from '@/assets/icon/ic-Free.svg';
import { LIST } from '@/constants/screen2';
import classNames from 'classnames';
import Marquee from "react-fast-marquee";
import { Carousel } from 'antd';
import { SWIPER } from '@/constants/screen3';
import { PARTNERS, TRUSTED } from '@/constants/screen4';
import BottomBackground from '@/components/BottomBackground';

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
            <Marquee
              gradient={false}
              speed={20}
              direction='left'
              className={styles.screen2RightMarquee}
            >
              {LIST.map((item: any, index: number) => {
                return (
                  <div
                    className={classNames(styles.screen2RightItem)}
                    key={index}
                  >
                    <div className={styles.screen2RightItemContent}>
                      <div className={styles.screen2RightItemContentTitle}>
                        {item?.title}
                      </div>
                      <div className={styles.screen2RightItemContentDesc}>
                        {item?.content}
                      </div>
                      {item?.list.length > 0 && (
                        <div className={styles.screen2RightItemContentList}>
                          <ul>
                            {item?.list.map((listItem: any, listIndex: any) => {
                              return (
                                <li key={listIndex}>
                                  {listItem}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className={styles.screen2RightItemIcon}>
                      <img
                        src={require(`@/assets/ic/${item.icon}`)}
                        alt="DAO Vote"
                        className={styles.screen2RightItemIconImg}
                      />
                    </div>
                  </div>
                )
              })}
            </Marquee>
          </div>
        </div>
      </div>
      <div className={styles.screen3}>
        <div className={styles.screen3background}>
          <div className={styles.screen3backgroundLeft} />
          <div className={styles.screen3backgroundRight} />
        </div>
        <div className={styles.screen3content}>
          <div className={styles.statistics}>
            <div className={styles.statisticsItem}>
              <div className={styles.statisticsItemValue}>
                136
              </div>
              <div className={styles.statisticsItemDesc}>
                {intl.formatMessage({
                  id: 'home.screen3.statisticsItem1'
                })}
              </div>
            </div>
            <div className={styles.statisticsItem}>
              <div className={styles.statisticsItemValue}>
                1500
              </div>
              <div className={styles.statisticsItemDesc}>
                {intl.formatMessage({
                  id: 'home.screen3.statisticsItem2'
                })}
              </div>
            </div>
            <div className={styles.statisticsItem}>
              <div className={styles.statisticsItemValue}>
                10
              </div>
              <div className={styles.statisticsItemDesc}>
                {intl.formatMessage({
                  id: 'home.screen3.statisticsItem3'
                })}
              </div>
            </div>
          </div>
          <div className={styles.carousel}>
            <Carousel
              autoplay
              effect="fade"
            >
              {SWIPER.map((item: any, index: number) => {
                return (
                  <div
                    className={styles.carouselItem}
                    key={index}
                  >
                    <div className={styles.carouselItemInfo}>
                      <div className={styles.carouselItemInfoTitleDesc}>
                        <div className={styles.carouselItemInfoTitle}>
                          {item.title}
                        </div>
                        <div className={styles.carouselItemInfoDesc}>
                          {item.desc}
                        </div>
                      </div>
                      <div className={styles.carouselItemInfoButton}>
                        {item.button}
                      </div>
                    </div>
                    <div className={styles.carouselItemCard}>
                      <img
                        className={styles.carouselItemCardImg}
                        src={require(`@/assets/swiper/${item.image}`)}
                        alt={item.title}
                      />
                    </div>
                  </div>
                )
              })}
            </Carousel>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureItem}>
              <div className={styles.featureItemIcon}>
                <Safe />
              </div>
              <div className={styles.featureItemTitle}>
                {intl.formatMessage({
                  id: 'home.screen3.featureItem1'
                })}
              </div>
              <div className={styles.featureItemContent}>
                {intl.formatMessage({
                  id: 'home.screen3.featureItem1.content'
                })}
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureItemIcon}>
                <Fast />
              </div>
              <div className={styles.featureItemTitle}>
                {intl.formatMessage({
                  id: 'home.screen3.featureItem2'
                })}
              </div>
              <div className={styles.featureItemContent}>
                {intl.formatMessage({
                  id: 'home.screen3.featureItem2.content'
                })}
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureItemIcon}>
                <Free />
              </div>
              <div className={styles.featureItemTitle}>
                {intl.formatMessage({
                  id: 'home.screen3.featureItem3'
                })}
              </div>
              <div className={styles.featureItemContent}>
                {intl.formatMessage({
                  id: 'home.screen3.featureItem3.content'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.screen4}>
        <div className={styles.screen4content}>
          <div className={styles.partners}>
            <div className={styles.partnersTitle}>
              {intl.formatMessage({
                id: 'home.screen4.partnersTitle'
              })}
            </div>
            <div className={styles.partnersContent}>
              {PARTNERS.map((item: any) => {
                return (
                  <div
                    className={styles.partnersContentItem}
                    key={item.name}
                  >
                    <item.logo
                      className={styles.partnersItemImg}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className={styles.trusted}>
          <div className={styles.trustedTitle}>
            {intl.formatMessage({
              id: 'home.screen4.trustedTitle'
            })}
          </div>
          <div className={styles.trustedRow}>
            <Marquee
              direction='left'
              gradient={false}
              speed={30}
              className={styles.trustedRowMarquee}
            >
              {TRUSTED.map((item: any) => {
                return (
                  <div
                    className={styles.trustedRowItem}
                    key={item.name}
                  >
                    <item.logo
                      className={styles.trustedItemImg}
                    />
                  </div>
                )
              })}
            </Marquee>
          </div>
          <div className={styles.trustedRow}>
            <Marquee
              direction='right'
              gradient={false}
              speed={30}
              className={styles.trustedRowMarquee}
            >
              {TRUSTED.map((item: any) => {
                return (
                  <div
                    className={styles.trustedRowItem}
                    key={item.name}
                  >
                    <item.logo
                      className={styles.trustedItemImg}
                    />
                  </div>
                )
              })}
            </Marquee>
          </div>
        </div>
      </div>
      <div className={styles.screen5}>
        <BottomBackground />
        <div className={styles.screen5content}>
          <div className={styles.screen5Title}>
            {intl.formatMessage({
              id: 'home.screen5.title'
            })}
          </div>
          <div className={styles.screen5Button}>
            <div className={styles.screen5ButtonLeft}>
              {intl.formatMessage({
                id: 'home.screen5.button'
              })}
            </div>
            <div className={styles.screen5ButtonRight}>
              <RightArrow />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Home;
