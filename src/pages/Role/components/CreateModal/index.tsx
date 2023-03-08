/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 16:18:09
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-09 00:25:26
 * @ Description: i@rua.moe
 */

import React, { useState } from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import { Modal, Select, Spin, message } from 'antd';
import classNames from 'classnames';
import { Loading3QuartersOutlined } from '@ant-design/icons';

const CreateModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isModalOpen, setIsModalOpen }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const intl = useIntl();

  return (
    <Modal
      centered
      open={isModalOpen}
      className={styles.createModalContainer}
      closable={false}
      footer={null}
    >
      {contextHolder}
      <div className={styles.contentContainer}>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            Role
          </div>
          <div className={styles.itemContent}>
            <Select
              size='large'
              bordered={false}
              className={styles.select}
              popupClassName={styles.selectPopup}
              defaultValue="lucy"
              onChange={() => {

              }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
              ]}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            Type
          </div>
          <div className={styles.itemContent}>
            <Select
              size='large'
              bordered={false}
              className={styles.select}
              popupClassName={styles.selectPopup}
              defaultValue="lucy"
              onChange={() => {

              }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
              ]}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            Appchain
          </div>
          <div className={styles.itemContent}>
            <Select
              size='large'
              bordered={false}
              className={styles.select}
              popupClassName={styles.selectPopup}
              defaultValue="lucy"
              onChange={() => {

              }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
              ]}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemTitle}>
            OCT Roles
          </div>
          <div className={styles.itemContent}>
            <Select
              size='large'
              bordered={false}
              className={styles.select}
              popupClassName={styles.selectPopup}
              defaultValue="lucy"
              onChange={() => {

              }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
              ]}
            />
          </div>
        </div>
        <div className={styles.buttons}>
          <div
            className={styles.button}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            {intl.formatMessage({
              id: 'role.modal.button.cancel'
            })}
          </div>
          <div
            className={classNames(styles.button, styles.buttonPrimary)}
            onClick={() => {
              setLoading(true);
              messageApi.open({
                type: 'success',
                content: 'Success',
                className: styles.message,
              });
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
                id: 'role.modal.button.ok'
              })
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateModal;
