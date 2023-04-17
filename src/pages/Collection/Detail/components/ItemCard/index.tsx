/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:59:56
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-27 04:29:51
 * @ Description: 
 */

import React from "react";
import styles from "./style.less";
import { useIntl } from "@umijs/max";
import { API_CONFIG } from "@/constants/config";

const ItemCard: React.FC<{
  item: any;
  contractType: string | undefined
  onClick?: () => void;
}> = ({ item, contractType, onClick }) => {
  const intl = useIntl();
  console.log(item)
  return (
    <div
      className={styles.itemContainer}
      onClick={onClick}
    >
      <div className={styles.itemCover}>
        {contractType === 'paras' && (
          <img
            src={item ? API_CONFIG().IPFS + item.metadata.media : require('@/assets/collection/icon.webp')}
            alt="cover"
            className={styles.itemCoverImage}
          />
        )}
        {contractType === 'mintbase' && (
          <img
            src={item ? item?.metadata.media : require('@/assets/collection/icon.webp')}
            alt="cover"
            className={styles.itemCoverImage}
          />
        )}
        {/* <img
          src={item?.media ? API_CONFIG().IPFS + item?.media : require('@/assets/collection/icon.webp')}
          alt="cover"
          className={styles.itemCoverImage}
        /> */}
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemMeta}>
          <div className={styles.itemMetaInfo}>
            <div className={styles.itemMetaInfoTitle}>
              {item?.metadata?.title}
            </div>
            <div className={styles.itemMetaInfoDescription}>
              {item?.metadata?.description}
            </div>
          </div>
        </div>
        <div className={styles.statisticsContainer}>
          {!!item?.copies && (
            <div className={styles.statisticsItem}>
              <div className={styles.statisticsItemTitle}>
                {intl.formatMessage({
                  id: 'collection.detail.itemCard.minted',
                })}
              </div>
              <div className={styles.statisticsItemValue}>
                {item?.minted_count}/{item?.copies}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
