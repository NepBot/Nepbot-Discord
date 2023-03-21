/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:59:56
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-22 04:22:20
 * @ Description: i@rua.moe
 */

import React, { useState } from "react";
import styles from "./style.less";
import { useIntl } from "umi";
import { Col, Row } from "antd";
import { TbCircleLetterN } from "react-icons/tb";

const ItemCard: React.FC<{
  item: any;
}> = ({ item }) => {
  const intl = useIntl();

  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemCover}>
        <img
          src="https://avatars.githubusercontent.com/u/16264281"
          alt="cover"
          className={styles.itemCoverImage}
        />
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemMeta}>
          <div className={styles.itemMetaIcon}>
            <img
              src="https://avatars.githubusercontent.com/u/16264281"
              alt="cover"
              className={styles.itemMetaIconImage}
            />
          </div>
          <div className={styles.itemMetaInfo}>
            <div className={styles.itemMetaInfoTitle}>
              Hikaru NFT
            </div>
            <div className={styles.itemMetaInfoDescription}>
              Daisy
            </div>
            <div className={styles.itemMetaInfoCreator}>
              {intl.formatMessage({
                id: "collection.item.creator"
              }, {
                name: 'Hikaru'
              })}
            </div>
          </div>
        </div>
        <div className={styles.itemDescription}>
          Ha Ha Ha Ha Ha Ha ! ! !
        </div>
        <div className={styles.tagsContainer}>
          <Row gutter={[10, 10]}>
            <Col span={6}>
              <div className={styles.tag}>
                Near
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.tag}>
                Oct
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.statisticsContainer}>
          <Row gutter={[30, 30]}>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  0.056
                  <TbCircleLetterN
                    className={styles.statisticsItemValueIcon}
                  />
                </div>
                <div className={styles.statisticsItemName}>
                  Price
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  10%
                </div>
                <div className={styles.statisticsItemName}>
                  Royality
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  3
                </div>
                <div className={styles.statisticsItemName}>
                  Total Copies
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  6
                </div>
                <div className={styles.statisticsItemName}>
                  Total Minted
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
