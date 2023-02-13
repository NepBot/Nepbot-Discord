/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 23:15:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-14 04:40:10
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl } from '@umijs/max';
import TopBackground from './components/TopBackground';
import { ReactComponent as RightArrow } from '@/assets/icon/right-arrow.svg';
import { ReactComponent as NearLogoWhite } from '@/assets/brand/near_logo_wht.svg';
import { ReactComponent as PopulaLogoWhite } from '@/assets/brand/popula_logo_wht.svg'
import { LIST } from '@/constants/screen2';
import classNames from 'classnames';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import Marquee from "react-fast-marquee";
import "swiper/css";
import "swiper/css/pagination";

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
            {/* <Swiper
              slidesPerView={"auto"}
              centeredSlides={true}
              spaceBetween={30}
              modules={[Autoplay]}
              pagination={{
                clickable: false,
              }}
              direction='vertical'
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              className={styles.screen2RightSwiper}
            > */}

            {/* </Swiper> */}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Home;
