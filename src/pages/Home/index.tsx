/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 23:15:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-11 21:33:12
 * @ Description: 
 */

import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import TopBackground from '@/components/TopBackground';
import { ReactComponent as RightArrow } from '@/assets/icon/right-arrow.svg';
import { ReactComponent as NearLogoWhite } from '@/assets/brand/near_logo_wht.svg';
import { ReactComponent as PopulaLogoWhite } from '@/assets/brand/popula_logo_wht.svg';
import { ReactComponent as Safe } from '@/assets/icon/ic-Safe.svg';
import { ReactComponent as Fast } from '@/assets/icon/ic-Fast.svg';
import { ReactComponent as Free } from '@/assets/icon/ic-Free.svg';
import { LIST } from '@/constants/home/list';
import classNames from 'classnames';
import Marquee from "react-fast-marquee";
import { Carousel, Col, Row } from 'antd';
import Fullpage, { FullPageSections, FullpageSection } from '@ap.cx/react-fullpage'
import { SWIPER } from '@/constants/home/swiper';
import { PARTNERS, TRUSTED } from '@/constants/home/partner';
import BottomBackground from '@/components/BottomBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BOT_URL, API_CONFIG } from '@/constants/config';
import { _NETWORK } from '@/constants/env';
import { GetTotalServerCount, GetTotalVerifiedCount } from '@/services/api';

const Home: React.FC = () => {
  const { nearAccount } = useModel('near.account');
  const intl = useIntl();
  const inviteUrl = _NETWORK === 'mainnet' ? BOT_URL.mainnet : BOT_URL.testnet;
  const [collectionCount, setCollectionCount] = useState()
  const [serverCount, setServerCount] = useState<string>()
  const [verifiedCount, setVerifiedCount] = useState<string>()

  useEffect(() => {
    (async () => {
      setVerifiedCount(((await GetTotalVerifiedCount())?.data as Resp.GetTotalVerifiedCount).data as string)
      setServerCount(((await GetTotalServerCount())?.data as Resp.GetTotalServerCount).data as string)
      setCollectionCount((await nearAccount?.viewFunction(API_CONFIG().NFT_CONTRACT, "get_collection_count", {})))
    })();
  }, [])

  return (
    <div className={styles.homeContainer}>
      <Fullpage>
        <FullPageSections>
          <FullpageSection>
            <div className={styles.screen1}>
              <Header />
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
                    discord: (
                      <span
                        className={styles.screen1DescBold}
                      >
                        Discord
                      </span>
                    ),
                    account: (
                      <span
                        className={styles.screen1DescLink}
                        onClick={() => {
                          window.open('https://near.org/', '_blank');
                        }}
                      >
                        NearProtocol
                      </span>
                    ),
                  })}
                </div>
                <div
                  className={styles.screen1Button}
                  onClick={() => {
                    window.open(inviteUrl, '_blank');
                  }}
                >
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
                <div
                  className={styles.screen1BarItem}
                  onClick={() => {
                    window.open('https://near.org/', '_blank');
                  }}
                >
                  {intl.formatMessage({
                    id: 'home.screen1.bar.poweredBy'
                  })}
                  <NearLogoWhite
                    className={styles.screen1BarItemIcon}
                  />
                </div>
                <div
                  className={styles.screen1BarItem}
                  onClick={() => {
                    window.open('https://popula.io/', '_blank');
                  }}
                >
                  {intl.formatMessage({
                    id: 'home.screen1.bar.backedBy'
                  })}
                  <PopulaLogoWhite
                    className={styles.screen1BarItemIcon}
                  />
                </div>
              </div>
            </div>
          </FullpageSection>
          <FullpageSection>
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
                  <div
                    className={styles.screen2LeftButton}
                    onClick={() => {
                      window.open('https://nepbot.github.io/Nepbot-gitbook/doc/What_is_Nepbot.html', '_blank');
                    }}
                  >
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
          </FullpageSection>
          <FullpageSection>
            <div className={styles.screen3}>
              <div className={styles.screen3background}>
                <div className={styles.screen3backgroundLeft} />
                <div className={styles.screen3backgroundRight} />
              </div>
              <div className={styles.screen3content}>
                <div className={styles.statistics}>
                  <div className={styles.statisticsItem}>
                    <div className={styles.statisticsItemValue}>
                      { serverCount } 
                    </div>
                    <div className={styles.statisticsItemDesc}>
                      {intl.formatMessage({
                        id: 'home.screen3.statisticsItem1'
                      })}
                    </div>
                  </div>
                  <div className={styles.statisticsItem}>
                    <div className={styles.statisticsItemValue}>
                      { verifiedCount }
                    </div>
                    <div className={styles.statisticsItemDesc}>
                      {intl.formatMessage({
                        id: 'home.screen3.statisticsItem2'
                      })}
                    </div>
                  </div>
                  <div className={styles.statisticsItem}>
                    <div className={styles.statisticsItemValue}>
                      { collectionCount }
                    </div>
                    <div className={styles.statisticsItemDesc}>
                      {intl.formatMessage({
                        id: 'home.screen3.statisticsItem3'
                      })}
                    </div>
                  </div>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureItem}>
                    <div className={styles.featureItemIcon}>
                      <Safe />
                    </div>
                    <div className={styles.featureItemTitle}>
                      {intl.formatMessage({
                        id: 'home.screen4.featureItem1'
                      })}
                    </div>
                    <div className={styles.featureItemContent}>
                      {intl.formatMessage({
                        id: 'home.screen4.featureItem1.content'
                      })}
                    </div>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureItemIcon}>
                      <Fast />
                    </div>
                    <div className={styles.featureItemTitle}>
                      {intl.formatMessage({
                        id: 'home.screen4.featureItem2'
                      })}
                    </div>
                    <div className={styles.featureItemContent}>
                      {intl.formatMessage({
                        id: 'home.screen4.featureItem2.content'
                      })}
                    </div>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureItemIcon}>
                      <Free />
                    </div>
                    <div className={styles.featureItemTitle}>
                      {intl.formatMessage({
                        id: 'home.screen4.featureItem3'
                      })}
                    </div>
                    <div className={styles.featureItemContent}>
                      {intl.formatMessage({
                        id: 'home.screen4.featureItem3.content'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FullpageSection>
          <FullpageSection>
            <div className={styles.screen4}>
              <div className={styles.screen4background}>
                <div className={styles.screen4backgroundLeft} />
                <div className={styles.screen4backgroundRight} />
              </div>
              <div className={styles.screen4content}>
                <div className={styles.carousel}>
                  <Carousel
                    autoplay
                    effect="fade"
                    dotPosition='bottom'
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
                            <div
                              className={styles.carouselItemInfoButton}
                              onClick={() => {
                                window.open(item.link, '_blank');
                              }}
                            >
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
              </div>
            </div>
          </FullpageSection>
          <FullpageSection>
            <div className={styles.screen5}>
              <div className={styles.screen5background}>
                <div className={styles.screen5backgroundLeft} />
                <div className={styles.screen5backgroundRight} />
              </div>
              <div className={styles.screen5content}>
                <div className={styles.partners}>
                  <div className={styles.partnersTitle}>
                    {intl.formatMessage({
                      id: 'home.screen5.partnersTitle'
                    })}
                  </div>
                  <div className={styles.partnersContent}>
                    <Row gutter={[50, 50]}>
                      {PARTNERS.map((item: any) => {
                        return (
                          <Col
                            xs={8} sm={6} md={4} lg={4} xl={4}
                            className={styles.partnersContentItem}
                            key={item.name}
                            onClick={() => {
                              window.open(item?.url, '_blank');
                            }}
                          >
                            <item.logo
                              className={styles.partnersItemImg}
                            />
                          </Col>
                        )
                      })}
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </FullpageSection>
          <FullpageSection>
            <div className={styles.screen6}>
              <div className={styles.screen6background}>
                <div className={styles.screen6backgroundLeft} />
                <div className={styles.screen6backgroundRight} />
              </div>
              <div className={styles.trusted}>
                <div className={styles.trustedTitle}>
                  {intl.formatMessage({
                    id: 'home.screen6.trustedTitle'
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
                          {typeof item.logo === "string" ? (
                            item?.logo
                          ) : (
                            <item.logo
                              className={styles.trustedItemImg}
                            />
                          )}
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
          </FullpageSection>
          <FullpageSection>
            <div className={styles.screen7}>
              <BottomBackground />
              <div className={styles.screen7content}>
                <div className={styles.screen7Title}>
                  {intl.formatMessage({
                    id: 'home.screen7.title'
                  })}
                </div>
                <div
                  className={styles.screen7Button}
                  onClick={() => {
                    window.open(inviteUrl, '_blank');
                  }}
                >
                  <div className={styles.screen7ButtonLeft}>
                    {intl.formatMessage({
                      id: 'home.screen7.button'
                    })}
                  </div>
                  <div className={styles.screen7ButtonRight}>
                    <RightArrow />
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </FullpageSection>
        </FullPageSections>
      </Fullpage>
    </div>
  )
};

export default Home;
