/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:07:16
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-28 16:10:27
 * @ Description: i@rua.moe
 */

import React, { useCallback, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import { IoCloseSharp } from 'react-icons/io5';
import { InputNumber, Spin, Tooltip, notification } from 'antd';
import classNames from 'classnames';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import UserLayout from '@/layouts/UserLayout';
import { API_CONFIG } from '@/constants/config';
import { GetMintSign } from '@/services/api';
import BN from 'bn.js';
import { ParseAmount } from '@/utils/near';
import { RequestTransaction } from '@/utils/contract';
import { FinalExecutionOutcome, FinalExecutionStatus } from 'near-api-js/lib/providers';
import { base58 } from 'ethers/lib/utils';

const Item: React.FC<{
  item?: Contract.WrappedCollections,
  onClick?: () => void,
  onCancel?: () => void,
}> = ({ item, onCancel }) => {
  const { nearAccount, nearWallet } = useModel('near.account');
  const { discordInfo, discordOperationSign } = useModel('store');
  const [inputValue, setInputValue] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorInput, setErrorInput] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<boolean>(false);

  const intl = useIntl();

  const Mint = useCallback(async () => {
    setLoading(true);
    try {
      const args = {
        user_id: discordInfo?.user_id,
        guild_id: discordInfo?.guild_id,
        channel_id: item?.inner_collection_id,
        sign: discordOperationSign,
      }

      const signature = await nearAccount?.connection.signer.signMessage(Buffer.from(JSON.stringify(args)), nearAccount?.accountId, API_CONFIG().networkId);
      const res = await GetMintSign({
        args,
        account_id: nearAccount?.accountId,
        sign: base58.encode(signature?.signature!),
      });

      if (!res?.data?.success) {
        setErrorState(true);
        notification.error({
          key: 'error.mint',
          message: 'Error',
          description: (res?.data as Resp.Error)?.message,
        });
        return;
      }

      const price = new BN(ParseAmount({
        amount: item?.price!,
      })?.toString()!).add(new BN('20000000000000000000000'));

      const result = await RequestTransaction({
        nearAccount: nearAccount,
        nearWallet: nearWallet,
        contractId: API_CONFIG().NFT_CONTRACT,
        methodName: 'nft_mint',
        args: {
          collection_id: item?.inner_collection_id,
          ...res?.data,
        },
        gas: '300000000000000',
        deposit: price?.mul(new BN(inputValue?.toString()!)).toString(),
      });

      if (!!((result as FinalExecutionOutcome)?.status as FinalExecutionStatus)?.SuccessValue) {
        setSuccessState(true);
      }

      setLoading(false);
    } catch (e: any) {
      setErrorState(true);
      notification.error({
        key: 'error.mint',
        message: 'Error',
        description: e.message,
      });
    }
  }, [nearAccount, nearWallet, discordOperationSign]);

  return (
    <UserLayout>
      <div className={styles.windowContainer}>
        <div className={styles.header}>
          <IoCloseSharp
            className={styles.closeIcon}
            onClick={() => {
              onCancel?.()
            }}
          />
        </div>
        <div className={styles.userContainer}>
          <div className={styles.avatar}>
            <img
              src={item?.media ? item?.media : require('@/assets/collection/icon.webp')}
              alt='media'
              className={styles.avatarImg}
            />
          </div>
          <div className={styles.nftName}>
            {item?.name}
          </div>
          {!!item?.total_copies && item?.minted_count && (
            <div className={styles.availableNum}>
              {intl.formatMessage({
                id: 'mint.availableNum'
              }, {
                num: item?.total_copies - item?.minted_count,
                total: item?.total_copies,
              })}
            </div>
          )}
        </div>
        <div className={styles.inputContainer}>
          <InputNumber
            bordered={false}
            size='large'
            placeholder={intl.formatMessage({
              id: 'mint.input.placeholder'
            })}
            type='number'
            controls={false}
            className={styles.input}
            min={1}
            value={inputValue}
            onChange={(e) => {
              if (!!item?.mint_count_limit && !!e && Number(e) > item?.mint_count_limit) {
                setErrorInput(true);
              } else {
                setErrorInput(false);
                setInputValue(Number(e));
              }
            }}
          />
        </div>
        {!!item?.mint_count_limit && (
          <Tooltip
            placement="top"
            title={intl.formatMessage({
              id: 'mint.limit.tooltip'
            })}
          >
            <div className={classNames(styles.limitContainer, errorInput && styles.limitContainerError)}>
              {intl.formatMessage({
                id: 'mint.limit'
              }, {
                num: item?.mint_count_limit,
              })}
            </div>
          </Tooltip>
        )}
        <div className={styles.buttonContainer}>
          <div
            className={classNames(styles.button, errorInput && styles.buttonDisable)}
            onClick={async () => {
              if (errorInput && loading) return;
              await Mint();
            }}
          >
            {loading ? (
              <Spin
                indicator={
                  <Loading3QuartersOutlined
                    className={styles.loadingIcon}
                    spin
                  />
                }
              />
            ) : (
              intl.formatMessage({
                id: 'mint.button'
              })
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  )
};

export default Item;
