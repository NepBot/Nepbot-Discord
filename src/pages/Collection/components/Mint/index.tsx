/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 00:39:24
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-01 02:42:14
 * @ Description: i@rua.moe
 */

import React, { useState } from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import Background from '@/components/TopBackground';
import Item from './components/Item';
import { Col, Row } from 'antd';
import UserLayout from '@/layouts/UserLayout';
import Fail from '@/components/Fail';
import Success from '@/components/Success';

const Mint: React.FC<{
  item?: Contract.WrappedCollections,
  onClick?: () => void,
  onCancel?: () => void,
}> = ({ item, onClick, onCancel }) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<boolean>(false);

  const intl = useIntl();

  return (
    <UserLayout>
      {errorState && !successState && (
        <Fail />
      )}
      {successState && !errorState && (
        <Success />
      )}
      {!errorState && !successState && (
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
                  setSuccessState={setSuccessState}
                  setErrorState={setErrorState}
                />
              </Col>
            </Row>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default Mint;
