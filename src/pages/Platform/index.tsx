/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:11:26
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-09 03:45:54
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import Background from '@/components/TopBackground';
import { SiDiscord } from 'react-icons/si';
import { Col, Row } from 'antd';
import Item from './components';

const Platform: React.FC = () => {
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
          </div>
          <div className={styles.discordServerName}>
            <SiDiscord
              className={styles.discordIcon}
            />
            server name
          </div>
          <div className={styles.selectContainer}>
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Item
                  icon="https://avatars.githubusercontent.com/u/16264281"
                  name="Paras"
                  desc="x paras.near"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Item
                  icon="https://avatars.githubusercontent.com/u/16264281"
                  name="Mintbase"
                  desc="x mintbase.near"
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platform;
