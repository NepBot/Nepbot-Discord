/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:11:26
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-22 22:17:04
 * @ Description: 
 */

import React from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import Background from '@/components/TopBackground';
import { SiDiscord } from 'react-icons/si';
import { Col, Row } from 'antd';
import Item from './components';
import { ReactComponent as Paras } from '@/assets/collection/paras.svg';
import { ReactComponent as Mintbase } from '@/assets/collection/mintbase.svg';
import { API_CONFIG } from '@/constants/config';
import { IoCloseSharp } from 'react-icons/io5';

const SelectPlatform: React.FC<{
  setSelectPlatform?: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSubmit?: () => void;
  onCancel?: () => void;
}> = ({ setSelectPlatform, onSubmit, onCancel }) => {
  const { discordServer } = useModel('discord');

  const intl = useIntl();

  return (
    <div className={styles.platformContainer}>
      <Background />
      <div className={styles.wrapper}>
        <div className={styles.windowContainer}>
          <div className={styles.header}>
            <div className={styles.title}>
              {intl.formatMessage({
                id: 'platform.title'
              })}
            </div>
            <div className={styles.subtitle}>
              {intl.formatMessage({
                id: 'platform.subtitle'
              })}
            </div>
            <IoCloseSharp
              className={styles.closeIcon}
              onClick={() => {
                if (!!onCancel) {
                  onCancel?.();
                }
              }}
            />
          </div>
          <div className={styles.discordServerName}>
            {!!discordServer?.iconURL ? (
              <img
                src={discordServer?.iconURL}
                alt={discordServer?.name}
                className={styles.discordIcon}
              />
            ) : (
              <SiDiscord
                className={styles.discordIcon}
              />
            )}
            {discordServer?.name}
          </div>
          <div className={styles.selectContainer}>
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Item
                  Icon={Paras}
                  name="Paras"
                  desc={API_CONFIG().PARAS_CONTRACT!}
                  onClick={() => {
                    if (!!setSelectPlatform) {
                      setSelectPlatform?.('paras');
                    }
                    if (!!onSubmit) {
                      onSubmit?.();
                    }
                  }}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Item
                  Icon={Mintbase}
                  name="Mintbase"
                  desc={API_CONFIG().MINTBASE_CONTRACT!}
                  onClick={() => {
                    if (!!setSelectPlatform) {
                      setSelectPlatform?.('mintbase');
                    }
                    if (!!onSubmit) {
                      onSubmit?.();
                    }
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPlatform;
