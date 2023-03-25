/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 16:18:09
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-26 00:19:11
 * @ Description: i@rua.moe
 */

import React, { useState } from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import { FormInstance, Modal, Select, Spin, message } from 'antd';
import classNames from 'classnames';
import { Loading3QuartersOutlined } from '@ant-design/icons';

const ConfirmModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}> = ({ isModalOpen, setIsModalOpen, onConfirm }) => {
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
        <div className={styles.title}>
          {intl.formatMessage({
            id: 'collection.create.modal.title'
          })}
        </div>
        <div className={styles.description}>
          {intl.formatMessage({
            id: 'collection.create.modal.description'
          })}
        </div>
        <div className={styles.buttons}>
          <div
            className={styles.button}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            {intl.formatMessage({
              id: 'collection.create.modal.button.cancel'
            })}
          </div>
          <div
            className={classNames(styles.button, styles.buttonPrimary)}
            onClick={async () => {
              if (loading) return;
              setLoading(true);
              await onConfirm();
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
                id: 'collection.create.modal.button.create'
              })
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
