/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 04:00:13
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-08 04:21:26
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import { RiDeleteBin4Line } from 'react-icons/ri';

const ItemCard: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.itemCardContainer}>
      <div className={styles.metaContainer}>
        <div className={styles.iconAndName}>
          <div className={styles.icon}>
            <img
              src="https://avatars.githubusercontent.com/u/16264281"
              alt=''
              className={styles.iconImg}
            />
          </div>
          <div className={styles.name}>
            Hikaru
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.button}>
            <RiDeleteBin4Line
              className={styles.buttonIcon}
            />
          </div>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.server'
            })}
          </div>
          <div className={styles.itemContent}>
            Hikaru
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.role'
            })}
          </div>
          <div className={styles.itemContent}>
            creator
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.type'
            })}
          </div>
          <div className={styles.itemContent}>
            Token Amount
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.tokenId'
            })}
          </div>
          <div className={styles.itemContent}>
            486097808
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.tokenSymbol'
            })}
          </div>
          <div className={styles.itemContent}>
            Token Amount
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.minAmount'
            })}
          </div>
          <div className={styles.itemContent}>
            1893976947
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemCard;
