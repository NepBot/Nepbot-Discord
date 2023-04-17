/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 16:18:09
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-28 00:32:45
 * @ Description: 
 */

import React, { useState } from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import { FormInstance, Modal, Select, Spin, message, notification } from 'antd';
import classNames from 'classnames';
import { Loading3QuartersOutlined } from '@ant-design/icons';

const ConfirmModal: React.FC<{
  form: FormInstance<any>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
}> = ({ isModalOpen, setIsModalOpen, onSubmit }) => {
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
              try {
                setLoading(true);
                await onSubmit();
                setIsModalOpen(false);
                messageApi.success(
                  intl.formatMessage({
                    id: 'collection.create.modal.success'
                  })
                );
              } catch (e: any) {
                setLoading(false);
                notification.error({
                  key: 'error.createCollectionError',
                  message: 'Error',
                  description: e.message,
                });
              }
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
