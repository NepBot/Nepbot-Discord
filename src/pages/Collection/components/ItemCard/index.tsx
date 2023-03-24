/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:59:56
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-25 02:33:54
 * @ Description: i@rua.moe
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
  item: Contract.WrappedCollections;
  roleMap: Map<string, string>;
  onClick?: () => void;
}> = ({ item, roleMap, onClick }) => {
  const { discordServer } = useModel('discord');

  const intl = useIntl();

  return (
    <div
      className={styles.itemContainer}
      onClick={onClick}
    >
      <div className={styles.itemCover}>
        {item?.contract_type === 'paras' && (
          <img
            src={item?.cover ? API_CONFIG().IPFS + item?.cover : require('@/assets/collection/banner.webp')}
            alt="cover"
            className={styles.itemCoverImage}
          />
        )}
        {item?.contract_type === 'mintbase' && (
          <img
            src={item?.background ? API_CONFIG().IPFS + item?.background : require('@/assets/collection/banner.webp')}
            alt="cover"
            className={styles.itemCoverImage}
          />
        )}
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemMeta}>
          <div className={styles.itemMetaIcon}>
            {item?.contract_type === 'paras' && (
              <img
                src={item?.media ? API_CONFIG().IPFS + item?.media : require('@/assets/collection/icon.webp')}
                alt="media"
                className={styles.itemMetaIconImage}
              />
            )}
            {item?.contract_type === 'mintbase' && (
              <img
                src={item?.logo ? API_CONFIG().IPFS + item?.logo : require('@/assets/collection/icon.webp')}
                alt="media"
                className={styles.itemMetaIconImage}
              />
            )}
            <img
              src={item?.logo ? API_CONFIG().IPFS + item?.logo : require('@/assets/collection/icon.webp')}
              alt="media"
              className={styles.itemMetaIconImage}
            />
            <Mintbase
              className={styles.itemMetaIconPlatform}
            />
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
                  }) : NaN}
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
                  {!!item?.royaltyTotal ? item?.royaltyTotal : NaN}%
                </div>
                <div className={styles.statisticsItemName}>
                  Royality
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  {!!item?.total_copies ? item?.total_copies : NaN}
                </div>
                <div className={styles.statisticsItemName}>
                  Total Copies
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.statisticsItem}>
                <div className={styles.statisticsItemValue}>
                  {!!item?.minted_count ? item?.minted_count : NaN}
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
