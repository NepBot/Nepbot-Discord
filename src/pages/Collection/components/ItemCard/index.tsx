/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:59:56
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-14 04:52:53
 * @ Description: 
 */

import React, { useState } from "react";
import styles from "./style.less";
import { useIntl, useModel } from "@umijs/max";
import { Col, Row } from "antd";
import { TbCircleLetterN } from "react-icons/tb";
import { API_CONFIG } from "@/constants/config";
import { FormatAmount } from "@/utils/near";
import { ReactComponent as Paras } from '@/assets/collection/paras.svg';
import { ReactComponent as Mintbase } from '@/assets/collection/mintbase.svg';

const ItemCard: React.FC<{
  item: any;
  roleMap: Map<string, string>;
  onClick?: () => void;
}> = ({ item, roleMap, onClick }) => {
  const { discordServer } = useModel('discord');
  const intl = useIntl();
  console.log(item)
  return (
    <div
      className={styles.itemContainer}
      onClick={onClick}
    >
      <div className={styles.itemCover}>
        {item?.contract_type === 'paras' && (
          <img
            src={!!item?.cover ? API_CONFIG().IPFS + item?.cover : require('@/assets/collection/banner.webp')}
            alt="cover"
            className={styles.itemCoverImage}
          />
        )}
        {item?.contract_type === 'mintbase' && (
          <img
            src={!!item?.background ? item?.background : require('@/assets/collection/banner.webp')}
            alt="cover"
            className={styles.itemCoverImage}
          />
        )}
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemMeta}>
          <div className={styles.itemMetaIcon}>
            {item?.contract_type === 'paras' && (
              <>
                <img
                  src={!!item?.media ? API_CONFIG().IPFS + item?.media : require('@/assets/collection/icon.webp')}
                  alt="media"
                  className={styles.itemMetaIconImage}
                />
                <Paras
                  className={styles.itemMetaIconPlatform}
                />
              </>
            )}
            {item?.contract_type === 'mintbase' && (
              <>
                <img
                  src={!!item?.logo ? item?.logo : require('@/assets/collection/icon.webp')}
                  alt="media"
                  className={styles.itemMetaIconImage}
                />
                <Mintbase
                  className={styles.itemMetaIconPlatform}
                />
              </>
            )}
          </div>
          <div className={styles.itemMetaInfo}>
            <div className={styles.itemMetaInfoTitle}>
              {item?.collection?.split("-guild-")[0].replaceAll("-", " ")}
            </div>
            <div className={styles.itemMetaInfoDescription}>
              {discordServer?.name}
            </div>
            <div className={styles.itemMetaInfoCreator}>
              {intl.formatMessage({
                id: "collection.item.creator"
              }, {
                name: item?.creator
              })}
            </div>
          </div>
        </div>
        <div className={styles.itemDescription}>
          {item?.description}
        </div>
        <div className={styles.tagsContainer}>
          <Row gutter={[10, 10]}>
            {item?.mintable_roles?.map((role: any) => {
              if (!!role && !!role?.length) {
                return (
                  <Col span={6}>
                    <div
                      className={styles.tag}
                      key={role}
                    >
                      {roleMap.get(role)}
                    </div>
                  </Col>
                )
              }
            })}
          </Row>
        </div>
        <div className={styles.statisticsContainer}>
          <Row gutter={[30, 30]}>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  {!!item?.price ? FormatAmount({
                    amount: item?.price,
                    decimals: 24,
                    fracDigits: 4,
                  }) : 0}
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
                  {!!item?.royaltyTotal ? item?.royaltyTotal : 0}%
                </div>
                <div className={styles.statisticsItemName}>
                  Royality
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  {!!item?.total_copies ? item?.total_copies : 0}
                </div>
                <div className={styles.statisticsItemName}>
                  Total Copies
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  {!!item?.minted_count ? item?.minted_count : 0}
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
