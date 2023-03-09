/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 21:36:12
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-10 04:05:15
 * @ Description: i@rua.moe
 */

import React, { useState } from 'react';
import styles from './style.less';
import { useIntl } from 'umi';
import { Button, Form, Input, InputNumber, Select, Space, Spin, Upload, message } from 'antd';
import { TbCircleLetterN } from 'react-icons/tb';
import { Loading3QuartersOutlined, PlusOutlined } from '@ant-design/icons';
import { FiDelete } from 'react-icons/fi';
import classNames from 'classnames';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ConfirmModal from './ConfirmModal';

const Create: React.FC = () => {
  const [form] = Form.useForm();
  const [logoUrl, setLogoUrl] = useState<string>();
  const [coverUrl, setCoverUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const intl = useIntl();

  const { Dragger } = Upload;

  return (
    <div className={styles.createContainer}>
      {contextHolder}
      <div className={styles.wrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.title}>
            {intl.formatMessage({
              id: "collection.create.title"
            })}
          </div>
        </div>
        <div className={styles.contentContainer}>
          <Form
            form={form}
            name="createCollection"
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
                      id: "collection.create.form.logo.label"
                    })}
                  </div>
                }
                name="logo"
                rules={[{
                  required: true,
                  message: intl.formatMessage({
                    id: "collection.create.form.logo.required"
                  })
                }]}
                className={classNames(styles.formItem, styles.formItemLogo)}
              >
                <Dragger
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  name="logo"
                  multiple={false}
                  listType="picture-card"
                  showUploadList={false}
                  onChange={(info) => {
                    setLogoUrl('https://avatars.githubusercontent.com/u/16264281');
                    // if (info.file.status === 'done') {
                    //   setLogoUrl(info.file.response.url);
                    // }

                    // if (info.file.status === 'removed') {
                    //   setLogoUrl('');
                    // }
                  }}
                  className={classNames(styles.formItemUploadContainer, logoUrl && styles.formItemUploadContainerHasFile)}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="avatar"
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
              <Form.Item
                label={
                  <div className={styles.formItemLabel}>
                    {intl.formatMessage({
                      id: "collection.create.form.cover.label"
                    })}
                  </div>
                }
                name="cover"
                className={classNames(styles.formItem, styles.formItemCover)}
              >
                <Dragger
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  name="cover"
                  multiple={false}
                  listType="picture-card"
                  showUploadList={false}
                  onChange={(info) => {
                    setCoverUrl('https://avatars.githubusercontent.com/u/16264281');
                    // if (info.file.status === 'done') {
                    //   setCoverUrl(info.file.response.url);
                    // }

                    // if (info.file.status === 'removed') {
                    //   setCoverUrl('');
                    // }
                  }}
                  className={classNames(styles.formItemUploadContainer, coverUrl && styles.formItemUploadContainerHasFile)}
                >
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt="avatar"
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
                    id: "collection.create.form.name.label"
                  })}
                </div>
              }
              name="name"
              rules={[{
                required: true,
                message: intl.formatMessage({
                  id: "collection.create.form.name.required"
                })
              }]}
              className={styles.formItem}
            >
              <div className={styles.formItemInputContainer}>
                <Input
                  bordered={false}
                  placeholder={intl.formatMessage({
                    id: "collection.create.form.name.placeholder"
                  })}
                  className={styles.formItemInput}
                />
              </div>
            </Form.Item>
            <Form.Item
              label={
                <div className={styles.formItemLabel}>
                  {intl.formatMessage({
                    id: "collection.create.form.description.label"
                  })}
                </div>
              }
              name="description"
              rules={[{
                required: true,
                message: intl.formatMessage({
                  id: "collection.create.form.description.required"
                })
              }]}
              className={styles.formItem}
            >
              <div className={styles.formItemInputContainer}>
                <Input
                  bordered={false}
                  placeholder={intl.formatMessage({
                    id: "collection.create.form.description.placeholder"
                  })}
                  className={styles.formItemInput}
                />
              </div>
            </Form.Item>
            <Form.Item
              label={
                <div className={styles.formItemLabel}>
                  {intl.formatMessage({
                    id: "collection.create.form.mintPrice.label"
                  })}
                  <TbCircleLetterN
                    className={styles.formItemLabelIcon}
                  />
                </div>
              }
              name="mintPrice"
              className={styles.formItem}
            >
              <div className={styles.formItemInputContainer}>
                <Input
                  bordered={false}
                  placeholder={intl.formatMessage({
                    id: "collection.create.form.mintPrice.placeholder"
                  })}
                  className={styles.formItemInput}
                />
              </div>
            </Form.Item>
            <Form.Item
              label={
                <div className={styles.formItemLabel}>
                  {intl.formatMessage({
                    id: "collection.create.form.royalty.label"
                  })}
                </div>
              }
              className={styles.formItem}
            >
              <div className={styles.formItemListContainer}>
                <Form.List
                  name="royalty"
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
                            name={[name, 'accountId']}
                            className={classNames(styles.formItem, styles.formListItem, styles.formListItemAccountId)}
                          >
                            <div className={classNames(styles.formItemInputContainer, styles.formListItemInputContainer)}>
                              <Input
                                bordered={false}
                                placeholder={intl.formatMessage({
                                  id: "collection.create.form.royalty.accountId.placeholder"
                                })}
                                className={styles.formItemInput}
                              />
                            </div>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'ratio']}
                            className={classNames(styles.formItem, styles.formListItem, styles.formListItemRatio)}
                          >
                            <div className={classNames(styles.formItemInputContainer, styles.formListItemInputContainer)}>
                              <InputNumber
                                bordered={false}
                                placeholder={intl.formatMessage({
                                  id: "collection.create.form.royalty.ratio.placeholder"
                                })}
                                className={styles.formItemInput}
                                addonAfter="%"
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
            <Form.Item
              label={
                <div className={styles.formItemLabelDesc}>
                  <div className={styles.formItemLabel}>
                    {intl.formatMessage({
                      id: "collection.create.form.requiredRole.label"
                    })}
                  </div>
                  <div className={styles.formItemLabelDescription}>
                    {intl.formatMessage({
                      id: "collection.create.form.requiredRole.description"
                    })}
                  </div>
                </div>
              }
              name="requiredRole"
              className={styles.formItem}
            >
              <div className={styles.formItemInputContainer}>
                <Select
                  allowClear

                  mode='multiple'
                  size='middle'
                  bordered={false}
                  className={styles.select}
                  popupClassName={styles.selectPopup}
                  onChange={() => {

                  }}
                  options={[
                    { value: 'eth', label: 'ETH' },
                    { value: 'near', label: 'Near' },
                    { value: 'oct', label: 'Oct' },
                    { value: 'btc', label: 'BTC' },
                  ]}
                />
              </div>
            </Form.Item>
            <div
              className={styles.formButtons}
            >
              <div
                className={styles.button}
                onClick={() => {
                  form.resetFields();
                  history.back();
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
                    form.submit();
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
      />
    </div>
  );
};

export default Create;
