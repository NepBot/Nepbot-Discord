/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 00:39:24
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-26 00:25:42
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import Background from '@/components/TopBackground';
import Item from './components/Item';
import { Col, Row } from 'antd';
import UserLayout from '@/layouts/UserLayout';

const Mint: React.FC<{
  item?: Contract.WrappedCollections,
  onClick?: () => void,
  onCancel?: () => void,
}> = ({ item, onClick, onCancel }) => {
  const intl = useIntl();

  return (
    <UserLayout>
      <div className={styles.mintContainer}>
        <Background />
        <div className={styles.wrapper}>
          <Row
            gutter={[30, 30]}
            className={styles.row}
          >
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Item
                item={item}
                onCancel={onCancel}
              />
            </Col>
          </Row>
        </div>
      </div>
    </UserLayout>
  );
};

export default Mint;
