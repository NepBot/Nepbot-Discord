/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:47:44
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-09 04:12:51
 * @ Description: i@rua.moe
 */

import React, { useState } from "react";
import styles from "./style.less";
import { useIntl } from "umi";
import { AiOutlinePlus } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";
import classNames from "classnames";
import { Col, Row } from "antd";
import ItemCard from "./components/ItemCard";

const Collection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const intl = useIntl();

  return (
    <div className={styles.collectionContainer}>
      <div className={styles.wrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.title}>
            {intl.formatMessage({
              id: "collection.title"
            })}
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
                id: 'collection.button.add'
              })}
            </div>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.itemContainer}>
            <div className={styles.itemTitle}>
              <AiFillCheckCircle
                className={classNames(styles.itemTitleIcon, styles.itemTitleIconHaveAccess)}
              />
              {intl.formatMessage({
                id: "collection.item.title.haveAccess"
              })}
            </div>
            <div className={styles.itemContent}>
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
        </div>
      </div>
    </div>
  )
};

export default Collection;
