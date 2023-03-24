/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:07:16
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-09 03:08:45
 * @ Description: i@rua.moe
 */

import React, { useState } from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import { IoCloseSharp } from 'react-icons/io5';
import { InputNumber } from 'antd';
import classNames from 'classnames';

const Item: React.FC = () => {
  const [total, setTotal] = useState<number>(10);
  const [availableNum, setAvailableNum] = useState<number>(9);
  const [limitNum, setLimitNum] = useState<number>(6);
  const [inputValue, setInputValue] = useState<number>();
  const [errorState, setErrorState] = useState<boolean>(false);

  const intl = useIntl();

  return (
    <div className={styles.windowContainer}>
      <div className={styles.header}>
        <IoCloseSharp
          className={styles.closeIcon}
        />
      </div>
      <div className={styles.userContainer}>
        <div className={styles.avatar}>
          <img
            src="https://avatars.githubusercontent.com/u/16264281"
            alt=''
            className={styles.avatarImg}
          />
        </div>
        <div className={styles.nftName}>
          MonkeONear GEN0
        </div>
        <div className={styles.availableNum}>
          {intl.formatMessage({
            id: 'mint.availableNum'
          }, {
            num: availableNum,
            total: total,
          })}
        </div>
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
          onChange={(e) => {
            if (!!e && Number(e) > limitNum) {
              setErrorState(true);
            } else {
              setErrorState(false);
              setInputValue(Number(e));
            }
          }}
        />
      </div>
      <div className={classNames(styles.limitContainer, errorState && styles.limitContainerError)}>
        {intl.formatMessage({
          id: 'mint.limit'
        }, {
          num: limitNum,
        })}
      </div>
      <div className={styles.buttonContainer}>
        <div className={classNames(styles.button, errorState && styles.buttonDisable)}>
          {intl.formatMessage({
            id: 'mint.button'
          })}
        </div>
      </div>
    </div>
  )
};

export default Item;
