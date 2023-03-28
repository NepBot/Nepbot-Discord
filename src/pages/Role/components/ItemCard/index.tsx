/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 04:00:13
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-28 18:28:58
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import { RiDeleteBin4Line } from 'react-icons/ri';
import { API_CONFIG } from '@/constants/config';
import { FormatAmount } from '@/utils/near';

const ItemCard: React.FC<{
  item: Contract.RuleItem;
  onDelete: (item: Contract.RuleItem) => void;
}> = ({ item, onDelete }) => {
  const { discordServer } = useModel('discord');

  const intl = useIntl();

  return (
    <div className={styles.itemCardContainer}>
      <div className={styles.metaContainer}>
        <div className={styles.iconAndName}>
          <div className={styles.icon}>
            <img
              src={!!item?.icon ? item.icon : require('@/assets/collection/icon.webp')}
              alt={item?.role_name}
              className={styles.iconImg}
            />
          </div>
          <div className={styles.name}>
            {item?.token_symbol}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div
            className={styles.button}
            onClick={() => onDelete(item)}
          >
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
              id: 'role.item.title.serverName'
            })}
          </div>
          <div className={styles.itemContent}>
            {discordServer?.name}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.guildName'
            })}
          </div>
          <div className={styles.itemContent}>
            {item?.guild_name}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.roleName'
            })}
          </div>
          <div className={styles.itemContent}>
            {item?.role_name}
          </div>
        </div>
        {!!item?.key_field && item?.key_field[0] === 'token_id' && (
          <>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.token'
                })}
              </div>
              <div className={styles.itemContent}>
                {item?.token_symbol}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.amount'
                })}
              </div>
              <div className={styles.itemContent}>
                {FormatAmount({
                  amount: item?.fields?.token_amount,
                  decimals: item?.decimals,
                })}
              </div>
            </div>
          </>
        )}
        {!!item?.key_field && item?.key_field[0] === 'appchain_id' && (
          <>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.appchain'
                })}
              </div>
              <div className={styles.itemContent}>
                {item?.key_field[1]}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.role'
                })}
              </div>
              <div className={styles.itemContent}>
                {item?.fields?.oct_role}
              </div>
            </div>
          </>
        )}
        {!!item?.key_field && item?.key_field[0] === 'near' && (
          <>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.nearBalance'
                })}
              </div>
              <div className={styles.itemContent}>
                {FormatAmount({
                  amount: item?.fields?.balance,
                })}
              </div>
            </div>
          </>
        )}
        {!!item?.key_field && (item?.key_field[0] === 'nft_contract_id' || item?.key_field[0] === API_CONFIG().PARAS_CONTRACT || item?.key_field[0] === API_CONFIG().H00KD_CONTRACT) && (
          <>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.nft'
                })}
              </div>
              <div className={styles.itemContent}>
                {item?.name}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.amount'
                })}
              </div>
              <div className={styles.itemContent}>
                {item?.fields?.token_amount}
              </div>
            </div>
          </>
        )}
        {!!item?.key_field && item?.key_field[0] === 'astrodao_id' && (
          <>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.contractId'
                })}
              </div>
              <div className={styles.itemContent}>
                {item?.key_field[1]}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.itemTitle}>
                {intl.formatMessage({
                  id: 'role.item.title.daoRole'
                })}
              </div>
              <div className={styles.itemContent}>
                {item?.fields?.astrodao_role}
              </div>
            </div>
          </>
        )}
        {!!item?.key_field && item?.key_field[0] === 'gating_rule' && (
          <>
            {item?.key_field[1] === 'Loyalty Level' && (
              <>
                <div className={styles.item}>
                  <div className={styles.itemTitle}>
                    {intl.formatMessage({
                      id: 'role.item.title.gatingRule'
                    })}
                  </div>
                  <div className={styles.itemContent}>
                    {item?.key_field[1]}
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemTitle}>
                    {intl.formatMessage({
                      id: 'role.item.title.loyaltyLevel'
                    })}
                  </div>
                  <div className={styles.itemContent}>
                    {item?.fields?.loyalty_level}
                  </div>
                </div>
              </>
            )}
            {item?.key_field[1] === 'Paras Staking' && (
              <>
                <div className={styles.item}>
                  <div className={styles.itemTitle}>
                    {intl.formatMessage({
                      id: 'role.item.title.gatingRule'
                    })}
                  </div>
                  <div className={styles.itemContent}>
                    {item?.key_field[1]}
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemTitle}>
                    {intl.formatMessage({
                      id: 'role.item.title.amount'
                    })}
                  </div>
                  <div className={styles.itemContent}>
                    {FormatAmount({
                      amount: item?.fields?.paras_staking_amount || '',
                      decimals: 18,
                    })}
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemTitle}>
                    {intl.formatMessage({
                      id: 'role.item.title.duration'
                    })}
                  </div>
                  <div className={styles.itemContent}>
                    {intl.formatMessage({
                      id: 'role.item.title.durationDays'
                    }, {
                      days: item?.fields?.paras_staking_duration
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            {intl.formatMessage({
              id: 'role.item.title.txHash'
            })}
          </div>
          <div
            className={styles.itemContent}
            onClick={() => window.open(`${API_CONFIG().explorerUrl}/txns/${item?.transaction_hash}`, '_blank')}
          >
            {!!item?.transaction_hash && item?.transaction_hash?.slice(0, 10) + '...' + item?.transaction_hash?.slice(-10)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemCard;
