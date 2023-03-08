/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 03:35:39
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-08 18:12:51
 * @ Description: i@rua.moe
 */


import React, { useState } from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { Col, Input, Row } from 'antd';
import ItemCard from './components/ItemCard';
import CreateModal from './components/CreateModal';

const Role: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const intl = useIntl();

  return (
    <div className={styles.roleContainer}>
      <div className={styles.wrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.searchContainer}>
            <AiOutlineSearch
              className={styles.searchIcon}
            />
            <Input
              bordered={false}
              placeholder={intl.formatMessage({
                id: 'role.search.placeholder'
              })}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.buttonsContainer}>
            <div
              className={styles.button}
              onClick={() => setIsModalOpen(true)}
            >
              <AiOutlinePlus
                className={styles.buttonIcon}
              />
              {intl.formatMessage({
                id: 'role.button.add'
              })}
            </div>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <Row gutter={[30, 30]}>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <ItemCard />
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <ItemCard />
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <ItemCard />
            </Col>
          </Row>
        </div>
      </div>
      <CreateModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  )
};

export default Role;
