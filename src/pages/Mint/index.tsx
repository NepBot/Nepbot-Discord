/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 00:39:24
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-09 03:15:19
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import Background from '@/components/TopBackground';
import Item from './components/Item';
import { Col, Row } from 'antd';

const Mint: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.mintContainer}>
      <Background />
      <div className={styles.wrapper}>
        <Row gutter={[30, 30]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Item />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Item />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Item />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Mint;
