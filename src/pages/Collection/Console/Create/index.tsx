/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 21:36:12
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-07 03:59:47
 * @ Description: i@rua.moe
 */

import React, { useCallback, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import { Button, Form, Input, InputNumber, Select, Spin, Upload, notification } from 'antd';
import { TbCircleLetterN } from 'react-icons/tb';
import { Loading3QuartersOutlined, PlusOutlined } from '@ant-design/icons';
import { FiDelete } from 'react-icons/fi';
import classNames from 'classnames';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ConfirmModal from './ConfirmModal';
import UserLayout from '@/layouts/UserLayout';
import { API_CONFIG } from '@/constants/config';
import { CreateParasCollection, GetCollection, GetOwnerSign } from '@/services/api';
import { ParseAmount, SignMessage } from '@/utils/near';
import { RequestTransaction } from '@/utils/contract';

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

interface RoyaltyItem {
  accountId: string;
  ratio: number;
}

const Create: React.FC<{
  selectPlatform?: string;
  urlSearch?: QueryParams;
  roleList?: Item.Role[];
  setErrorState?: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: () => void;
  onCancel?: () => void;
}> = ({ selectPlatform, urlSearch, roleList, setErrorState, onSubmit, onCancel }) => {
  const { nearAccount, nearWallet, setCallbackUrl, GetKeyStore } = useModel('near.account');
  const { discordServer } = useModel('discord');
  const { mintbaseWallet } = useModel('mintbase');
  const { discordInfo, discordOperationSign } = useModel('store');

  const [form] = Form.useForm();
  const [logoUrl, setLogoUrl] = useState<string>();
  const [coverUrl, setCoverUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [royalty, setRoyalty] = useState<{}>({});
  const [parasCreatedList, setParasCreatedList] = useState<any[]>([]);

  const intl = useIntl();

  const { Dragger } = Upload;

  const handleRoyalty = async () => {
    await form.validateFields();
    var royaltyCount = 0;
    var royalty_list: any = {};
    const values = await form.getFieldsValue();
    values?.royalty?.forEach((royalty: RoyaltyItem) => {
      if (!!royalty?.accountId && !!royalty?.ratio) {
        royalty_list[royalty?.accountId] = royalty?.ratio * 100;
        royaltyCount += 1;
      }
    });
    setRoyalty(royaltyCount ? royalty_list : null);
  };

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      const values = await form.getFieldsValue();
      setLoading(true);
      const outerCollectionId = `${values.name.replace(/\s+/g, "-")}-guild-${discordServer?.name?.replace(/\s+/g, "-")}-by-${API_CONFIG().NFT_CONTRACT?.replaceAll(".", "")}`.toLowerCase().replaceAll(".", "");

      var res: any;

      switch (selectPlatform) {
        case 'paras':
          const collection = await GetCollection({
            collection_id: outerCollectionId
          });
          if (!collection || !!(collection.data as Resp.GetCollection)?.data?.results?.length || parasCreatedList.indexOf(values?.name) > -1) {
            try {
              await nearAccount?.viewFunction(API_CONFIG()?.NFT_CONTRACT, 'get_collection', {
                collection_id: `paras:${outerCollectionId}`
              });
              setLoading(false);
              setIsModalOpen(false);
              notification.error({
                key: 'error.createCollection',
                message: "Error",
                description: "Collection name already exists"
              });
              return;
            } catch (error) {
              res = {
                collection_id: outerCollectionId,
              }
            }
          } else {
            var params: any = {
              args: {
                args: {
                  collection: `${values.name.replace(/\s+/g, "-")}-guild-${discordServer?.name?.replace(/\s+/g, "-")}`,
                  description: values.description,
                  creator_id: API_CONFIG().NFT_CONTRACT,
                  twitter: "",
                  website: "",
                  discord: "",
                },
                sign: discordOperationSign,
                user_id: discordInfo?.user_id,
                guild_id: discordInfo?.guild_id
              },
              account_id: nearAccount?.accountId,
            }
            const keystore = await GetKeyStore(nearAccount?.accountId);

            if (!keystore) {
              return;
            };

            const sign = await SignMessage({
              keystore: keystore,
              object: params.args,
            });

            params.sign = sign?.signature;

            const result = await CreateParasCollection({
              logo: values?.logo,
              cover: values?.cover,
              params: params
            });

            if (result?.response?.status === 200) {
              res = result.data;

              if (!!res.collection_id) {
                setParasCreatedList([...parasCreatedList, values?.name]);
              }
            }
          }
          break;
        case 'mintbase':
          const logoRes = await mintbaseWallet?.minter?.upload(values?.logo);
          const coverRes = await mintbaseWallet?.minter?.upload(values?.cover);
          await mintbaseWallet?.minter?.setMetadata({
            metadata: {
              name: values?.name?.trim(),
              description: values?.description,
              logo: logoRes?.data?.uri,
              background: coverRes?.data?.uri,
            }
          });
          const result = await mintbaseWallet?.minter?.getMetadataId();
          res = {
            collection_id: result?.data
          }
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
        account_id: nearAccount?.accountId,
        sign: sign?.signature,
      });

      if (!discordOperationSign) {
        setErrorState?.(true);
        return;
      }

      // Contract Request
      const contract_args: any = {
        outer_collection_id: res.collection_id,
        contract_type: selectPlatform,
        guild_id: discordInfo?.guild_id,
        royalty: royalty,
        mintable_roles: values.role_id,
        price: ParseAmount({
          amount: values?.mintPrice,
        }) || "0",
        ...(_sign.data as Resp.GetOwnerSign)?.data,
      };

      if (values.mintLimit) {
        contract_args.mint_count_limit = parseInt(values.mintLimit);
      }

      var callbackUrl: string = "";
      switch (selectPlatform) {
        case 'paras':
          callbackUrl = `${window.location.origin}/collection/console/paras:${outerCollectionId}${location.search}`;
          break;
        case 'mintbase':
          callbackUrl = `${window.location.origin}/collection/console/mintbase:${res.collection_id}${location.search}`
          break;
      }

      const data = await RequestTransaction({
        nearAccount: nearAccount,
        nearWallet: nearWallet,
        contractId: API_CONFIG().NFT_CONTRACT,
        methodName: 'create_collection',
        args: contract_args,
        gas: '300000000000000',
        deposit: '20000000000000000000000',
        walletCallbackUrl: callbackUrl,
        setCallbackUrl: setCallbackUrl,
      });

      setTimeout(() => {
        if (!!data) {
          setLoading(false);
          setIsModalOpen(false);
          form.resetFields();
          setLogoUrl('');
          setCoverUrl('');
          onSubmit?.();
        }
      });

    } catch (error: any) {
      setLoading(false);
      setErrorState?.(true);
      notification.error({
        key: 'error.createCollection',
        message: "Error",
        description: error,
      });
      return;
    }
  }, [nearAccount, nearWallet, discordServer, discordInfo, discordOperationSign, mintbaseWallet]);

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
    <UserLayout>
      <div className={styles.createContainer}>
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
                  required
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
                    name="logo"
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
                          logo: info?.file?.originFileObj
                        });
                        await getBase64(info?.file?.originFileObj, (url) => {
                          setLogoUrl(url);
                          setLoading(false);
                        });
                        return;
                      }
                    }}
                    className={classNames(styles.formItemUploadContainer, logoUrl && styles.formItemUploadContainerHasFile)}
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="logo"
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
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "collection.create.form.cover.required"
                    })
                  }]}
                  className={classNames(styles.formItem, styles.formItemCover)}
                >
                  <Dragger
                    name="cover"
                    multiple={false}
                    listType="picture-card"
                    showUploadList={false}
                    onChange={async (info) => {
                      if (info.file.status === 'uploading') {
                        setLoading(true);
                        return;
                      }

                      if (info.file.status === 'done' && !!info?.file?.originFileObj) {
                        form.setFieldsValue({
                          cover: info?.file?.originFileObj
                        });
                        await getBase64(info?.file?.originFileObj, (url) => {
                          setCoverUrl(url);
                          setLoading(false);
                        });
                        return;
                      }
                    }}
                    className={classNames(styles.formItemUploadContainer, coverUrl && styles.formItemUploadContainerHasFile)}
                  >
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt="cover"
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
                  <InputNumber
                    bordered={false}
                    placeholder={intl.formatMessage({
                      id: "collection.create.form.mintPrice.placeholder"
                    })}
                    className={styles.formItemInput}
                    controls={false}
                    type='number'
                    min={1}
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
                              rules={[{
                                required: true,
                                message: intl.formatMessage({
                                  id: "collection.create.form.royalty.accountId.required"
                                })
                              }]}
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
                              rules={[{
                                required: true,
                                message: intl.formatMessage({
                                  id: "collection.create.form.royalty.ratio.required"
                                })
                              }]}
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
                                  min={1}
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
                    showSearch
                    mode='multiple'
                    size='middle'
                    bordered={false}
                    className={styles.select}
                    popupClassName={styles.selectPopup}
                    options={(roleList || []).map((role) => ({
                      label: role.name,
                      value: role.id,
                      key: role.id,
                    }))}
                    onChange={(value) => {
                      form.setFieldsValue({
                        requiredRole: value
                      });
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item
                label={
                  <div className={styles.formItemLabelDesc}>
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "collection.create.form.mintLimit.label"
                      })}
                    </div>
                    <div className={styles.formItemLabelDescription}>
                      {intl.formatMessage({
                        id: "collection.create.form.mintLimit.description"
                      })}
                    </div>
                  </div>
                }
                name="mintLimit"
                className={styles.formItem}
              >
                <div className={styles.formItemInputContainer}>
                  <InputNumber
                    bordered={false}
                    placeholder={intl.formatMessage({
                      id: "collection.create.form.mintLimit.placeholder"
                    })}
                    className={styles.formItemInput}
                    controls={false}
                    type='number'
                    min={1}
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
                    if (!!onCancel) {
                      onCancel?.();
                    }
                  }}
                >
                  {intl.formatMessage({
                    id: 'collection.create.form.button.cancel'
                  })}
                </div>
                <div
                  className={classNames(styles.button, styles.buttonPrimary)}
                  onClick={async () => {
                    if (loading) return;
                    if (await form.validateFields()) {
                      form.submit();
                      await handleRoyalty();
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
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onConfirm={handleSubmit}
        />
      </div>
    </UserLayout>
  );
};

export default Create;
