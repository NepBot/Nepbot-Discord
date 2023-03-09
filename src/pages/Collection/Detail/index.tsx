/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 19:42:06
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-09 21:34:10
 * @ Description: i@rua.moe
 */

import React, { useState } from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { Col, Input, Row } from 'antd';
import { SiDiscord } from 'react-icons/si';
import ItemCard from '../components/ItemCard';

const CollectionDetail: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const intl = useIntl();

  return (
    <div className={styles.collectionDetailContainer}>
      <div className={styles.cover}>
        <img
          src="https://avatars.githubusercontent.com/u/16264281"
          alt='cover'
          className={styles.coverImage}
        />
      </div>
      <div className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <div className={styles.searchContainer}>
            <AiOutlineSearch
              className={styles.searchIcon}
            />
            <Input
              bordered={false}
              placeholder={intl.formatMessage({
                id: 'role.search.placeholder'
              })}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.buttonsContainer}>
            <div
              className={styles.button}
              onClick={() => setIsModalOpen(true)}
            >
              <AiOutlinePlus
                className={styles.buttonIcon}
              />
              {intl.formatMessage({
                id: 'role.button.add'
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.iconContainer}>
            <img
              src="https://avatars.githubusercontent.com/u/16264281"
              alt='icon'
              className={styles.iconImage}
            />
          </div>
          <div className={styles.contentHeaderContainer}>
            <div className={styles.metaContainer}>
              <div className={styles.metaTitle}>
                Hikaru GEN0
              </div>
              <div className={styles.metaCreator}>
                {intl.formatMessage({
                  id: 'collection.detail.creator'
                }, {
                  name: <b>monkeonea...opia.near</b>
                })}
              </div>
              <div className={styles.metaCreator}>
                {intl.formatMessage({
                  id: 'collection.detail.contract'
                }, {
                  name: <b>nepbot.mintbase1.near</b>
                })}
              </div>
            </div>
            <div className={styles.discordContainer}>
              <SiDiscord
                className={styles.discordIcon}
              />
              server name
            </div>
          </div>
          <div className={styles.statisticContainer}>
            <div className={styles.statisticItem}>
              <div className={styles.statisticItemValue}>
                3
              </div>
              <div className={styles.statisticItemLabel}>
                {intl.formatMessage({
                  id: 'collection.detail.statistic.totalCopies'
                })}
              </div>
            </div>
            <div className={styles.statisticItem}>
              <div className={styles.statisticItemValue}>
                6
              </div>
              <div className={styles.statisticItemLabel}>
                {intl.formatMessage({
                  id: 'collection.detail.statistic.totalMinted'
                })}
              </div>
            </div>
          </div>
          <div className={styles.descriptionContainer}>
            The first ever community voting tool and wallet management tool that comes with built-in data analysis system to find the best project on near protocol.
          </div>
          <div className={styles.itemsContainer}>
            <Row gutter={[30, 30]}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <ItemCard />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <ItemCard />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <ItemCard />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
