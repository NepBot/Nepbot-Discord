/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 21:36:12
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-07 04:31:29
 * @ Description: i@rua.moe
 */

import React, { useCallback, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import { Button, Form, Input, InputNumber, Spin, Upload, message, notification } from 'antd';
import { Loading3QuartersOutlined, PlusOutlined } from '@ant-design/icons';
import { FiDelete } from 'react-icons/fi';
import classNames from 'classnames';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ConfirmModal from './ConfirmModal';
import { CreateSeries, GetOwnerSign } from '@/services/api';
import { API_CONFIG } from '@/constants/config';
import { RequestTransaction } from '@/utils/contract';
import Fail from '@/components/Fail';
import { SignMessage } from '@/utils/near';

const Add: React.FC<{
  collectionInfo: Contract.CollectionInfo,
  onSubmit?: () => void,
  onCancel?: () => void,
}> = ({ collectionInfo, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const { nearAccount, nearWallet, GetKeyStore } = useModel('near.account');
  const { discordInfo, discordOperationSign } = useModel('store');
  const { mintbaseWallet } = useModel('mintbase');
  const [imageUrl, setImageUrl] = useState<string>();
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const intl = useIntl();

  const { Dragger } = Upload;

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      const values = await form.getFieldsValue();

      setLoading(true);
      const outer_collection_id = collectionInfo?.collection_id?.split(':')[1];

      const params = {
        collection: collectionInfo?.name?.replaceAll("-", " "),
        description: values?.description,
        creator_id: nearAccount?.accountId,
        collection_id: outer_collection_id,
        attributes: values?.attribute,
        mime_type: values?.image?.type,
        blurhash: "UE3UQdpLQ8VWksZ}Z~ksL#Z}pfkXVWp0kXVq"
      }

      var media: string | undefined;
      var reference: string | undefined;
      switch (collectionInfo?.contract_type) {
        case 'paras':
          const res = await CreateSeries({
            image: values?.image,
            ...params
          });
          if (!res?.data) {
            notification.error({
              key: 'error.create',
              message: 'Error',
              description: (res?.data as Resp.Error)?.message,
            });
          }

          const data = (res?.data as Resp.CreateSeries).data;
          media = data[0]?.replace("ipfs://", "");
          reference = data[1]?.replace("ipfs://", "");
          break;
        case 'mintbase':
          const mediaRes = await mintbaseWallet?.minter?.upload(values?.image);
          media = mediaRes?.data?.uri;
          reference = mediaRes?.data?.uri;
          break;
      }

      const args = {
        sign: discordOperationSign,
        user_id: discordInfo?.user_id,
        guild_id: discordInfo?.guild_id,
      }

      const keystore = await GetKeyStore(nearAccount?.accountId);

      if (!keystore) {
        return;
      };

      const sign = await SignMessage({
        keystore: keystore,
        object: args,
      });

      const _sign = await GetOwnerSign({
        args: args,
        sign: sign?.signature,
        account_id: nearAccount?.accountId,
      });

      if (!discordOperationSign) {
        notification.error({
          key: 'error.create',
          message: 'Error',
          description: "Discord sign error",
        });
        setLoading(false);
        setErrorState(true);
        return;
      }

      const data = await RequestTransaction({
        nearAccount: nearAccount,
        nearWallet: nearWallet,
        contractId: API_CONFIG().NFT_CONTRACT,
        methodName: 'add_token_metadata',
        args: {
          collection_id: collectionInfo?.collection_id,
          token_metadata: {
            title: values.name,
            description: values.description,
            media: media,
            reference: reference,
            copies: Number(values.copies)
          },
          ...(_sign?.data as Resp.GetOwnerSign)?.data,
        },
        gas: '300000000000000',
        deposit: '20000000000000000000000',
      });

      if (!!data) {
        messageApi.success('Success');
        setLoading(false);
        form.resetFields();
        setImageUrl('');
        onSubmit?.();
      }
    } catch (e: any) {
      console.log(e);
      setLoading(false);
      setErrorState(true);
      notification.error({
        key: 'error.create',
        message: 'Error',
        description: e.message,
      });
    }
  }, []);

  const beforeUpload = (file: File) => {
    const isAllowType = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/svg+xml';
    if (!isAllowType) {
      notification.error({
        key: 'error.createCollection',
        message: "Error",
        description: "Only support jpg, jpeg, png, gif, svg format",
      });
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      notification.error({
        key: 'error.createCollection',
        message: "Error",
        description: "Image must smaller than 10MB!",
      });
    }
    return isAllowType && isLt10M;
  };

  const getBase64 = (img: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  return (
    <>
      {errorState && (
        <Fail />
      )}
      {!errorState && (
        <div className={styles.createContainer}>
          {contextHolder}
          <div className={styles.wrapper}>
            <div className={styles.headerContainer}>
              <div className={styles.title}>
                {intl.formatMessage({
                  id: "collection.add.title"
                })}
              </div>
            </div>
            <div className={styles.contentContainer}>
              <Form
                form={form}
                name="createItem"
                autoComplete="off"
                labelWrap={true}
                layout="vertical"
                className={styles.formContainer}
              >
                <div className={styles.formItemRow}>
                  <Form.Item
                    label={
                      <div className={styles.formItemLabel}>
                        {intl.formatMessage({
                          id: "collection.add.form.image.label"
                        })}
                      </div>
                    }
                    required
                    name="image"
                    rules={[{
                      required: true,
                      message: intl.formatMessage({
                        id: "collection.add.form.image.required"
                      })
                    }]}
                    className={classNames(styles.formItem, styles.formItemLogo)}
                  >
                    <Dragger
                      name="image"
                      multiple={false}
                      listType="picture-card"
                      beforeUpload={beforeUpload}
                      showUploadList={false}
                      onChange={async (info) => {
                        if (info.file.status === 'uploading') {
                          setLoading(true);
                          return;
                        }

                        if (info.file.status === 'done' && !!info?.file?.originFileObj) {
                          form.setFieldsValue({
                            image: info?.file?.originFileObj
                          });
                          await getBase64(info?.file?.originFileObj, (url) => {
                            setImageUrl(url);
                            setLoading(false);
                          });
                          return;
                        }
                      }}
                      className={classNames(styles.formItemUploadContainer, imageUrl && styles.formItemUploadContainerHasFile)}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="image"
                          className={styles.formItemUploadImage}
                        />
                      ) : (
                        <>
                          <div className={styles.formItemUploadIcon}>
                            <AiOutlineCloudUpload />
                          </div>
                          <div className={styles.formItemUploadText}>
                            {intl.formatMessage({
                              id: "collection.create.form.upload.text"
                            })}
                          </div>
                          <div className={styles.formItemUploadOr}>
                            {intl.formatMessage({
                              id: "collection.create.form.upload.or"
                            })}
                          </div>
                          <div className={styles.formItemUploadButton}>
                            {intl.formatMessage({
                              id: "collection.create.form.upload.button"
                            })}
                          </div>
                        </>
                      )}
                    </Dragger>
                    <div className={styles.formItemLogoTip}>
                      {intl.formatMessage({
                        id: "collection.create.form.upload.tip"
                      })}
                    </div>
                  </Form.Item>
                </div>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "collection.add.form.name.label"
                      })}
                    </div>
                  }
                  name="name"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "collection.add.form.name.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Input
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "collection.add.form.name.placeholder"
                      })}
                      className={styles.formItemInput}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "collection.add.form.description.label"
                      })}
                    </div>
                  }
                  name="description"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "collection.add.form.description.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Input
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "collection.add.form.description.placeholder"
                      })}
                      className={styles.formItemInput}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "collection.add.form.copies.label"
                      })}
                    </div>
                  }
                  name="copies"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "collection.add.form.copies.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <InputNumber
                      controls={false}
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "collection.add.form.copies.placeholder"
                      })}
                      type='number'
                      className={styles.formItemInput}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "collection.add.form.attributes.label"
                      })}
                    </div>
                  }
                  className={styles.formItem}
                >
                  <div className={styles.formItemListContainer}>
                    <Form.List
                      name="attributes"
                    >
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              className={styles.formItemSpaceContainer}
                            >
                              <Form.Item
                                {...restField}
                                name={[name, 'trait_type']}
                                className={classNames(styles.formItem, styles.formListItem)}
                                rules={[{
                                  required: true,
                                  message: intl.formatMessage({
                                    id: "collection.add.form.attributes.type.required"
                                  })
                                }]}
                              >
                                <div className={classNames(styles.formItemInputContainer, styles.formListItemInputContainer)}>
                                  <Input
                                    bordered={false}
                                    placeholder={intl.formatMessage({
                                      id: "collection.add.form.attributes.type.placeholder"
                                    })}
                                    className={styles.formItemInput}
                                  />
                                </div>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'value']}
                                className={classNames(styles.formItem, styles.formListItem)}
                                rules={[{
                                  required: true,
                                  message: intl.formatMessage({
                                    id: "collection.add.form.attributes.value.required"
                                  })
                                }]}
                              >
                                <div className={classNames(styles.formItemInputContainer, styles.formListItemInputContainer)}>
                                  <InputNumber
                                    bordered={false}
                                    placeholder={intl.formatMessage({
                                      id: "collection.add.form.attributes.value.placeholder"
                                    })}
                                    className={styles.formItemInput}
                                    controls={false}
                                    type='number'
                                  />
                                </div>
                              </Form.Item>
                              <FiDelete
                                className={styles.deleteButton}
                                onClick={() => {
                                  remove(name)
                                }}
                              />
                            </div>
                          ))}
                          <Form.Item
                            className={classNames(styles.formItem, styles.formListItem)}
                          >
                            <Button
                              ghost
                              size='large'
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                              className={styles.formItemAddButton}
                            >
                              Add field
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                </Form.Item>
                <div
                  className={styles.formButtons}
                >
                  <div
                    className={styles.button}
                    onClick={() => {
                      form.resetFields();
                      onCancel?.();
                    }}
                  >
                    {intl.formatMessage({
                      id: 'collection.create.form.button.cancel'
                    })}
                  </div>
                  <div
                    className={classNames(styles.button, styles.buttonPrimary)}
                    onClick={async () => {
                      if (await form.validateFields()) {
                        setIsModalOpen(true);
                        setLoading(true);
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
                        id: 'collection.create.form.button.ok'
                      })
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </div>
          <ConfirmModal
            form={form}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </>
  );
};

export default Add;
