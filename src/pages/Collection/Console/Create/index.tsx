/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 21:36:12
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-27 22:09:28
 * @ Description: i@rua.moe
 */

import React, { useCallback, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel, useLocation } from '@umijs/max';
import { Button, Form, Input, InputNumber, Select, Space, Spin, Upload, message, notification } from 'antd';
import { TbCircleLetterN } from 'react-icons/tb';
import { Loading3QuartersOutlined, PlusOutlined } from '@ant-design/icons';
import { FiDelete } from 'react-icons/fi';
import classNames from 'classnames';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ConfirmModal from './ConfirmModal';
import UserLayout from '@/layouts/UserLayout';
import { API_CONFIG } from '@/constants/config';
import { CreateParasCollection, GetCollection, GetOwnerSign } from '@/services/api';
import { ParseAmount } from '@/utils/near';
import { RequestTransaction } from '@/utils/contract';
import { base58 } from 'ethers/lib/utils';

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
  const { nearAccount, nearWallet, setCallbackUrl } = useModel('near.account');
  const { discordServer } = useModel('discord');
  const { mintbaseWallet } = useModel('mintbase');
  const { discordInfo, discordOperationSign } = useModel('store');

  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<File>();
  const [coverFile, setCoverFile] = useState<File>();
  const [logoUrl, setLogoUrl] = useState<string>();
  const [coverUrl, setCoverUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [royalty, setRoyalty] = useState<Map<string, number>>(new Map());
  const [parasCreatedList, setParasCreatedList] = useState<any[]>([]);

  const intl = useIntl();
  const location = useLocation();

  const { Dragger } = Upload;

  const handleRoyalty = async () => {
    await form.validateFields();
    const values = await form.getFieldsValue();
    values.royalty.forEach((item: RoyaltyItem) => {
      if (!!item?.accountId && !!item?.ratio) {
        setRoyalty((royalty) => {
          royalty.set(item.accountId, item.ratio * 100);
          return royalty;
        });
      }
    });
  };

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      const values = await form.getFieldsValue();
      setLoading(true);
      const outerCollectionId = `${values?.name.replace(/\s+/g, "-")}-guild-${discordServer?.name?.replace(/\s+/g, "-")}-by-${API_CONFIG()?.NFT_CONTRACT?.replaceAll(".", "")}`.toLowerCase().replaceAll(".", "");

      var res: any;
      switch (selectPlatform) {
        case 'paras':
          const collection = await GetCollection({
            collection_id: outerCollectionId
          });
          if (!collection || !(collection.data as Resp.GetCollection)?.data?.results?.length || parasCreatedList.indexOf(values?.name) > -1) {
            try {
              const contract = await nearAccount?.viewFunction(API_CONFIG()?.NFT_CONTRACT, 'get_collection', {
                collection_id: `paras:${outerCollectionId}`
              });
              setLoading(false);
              if (!!contract) {
                notification.error({
                  key: 'error.createCollection',
                  message: "Error",
                  description: "Collection name already exists"
                });
              }
            } catch (error) {
              res = {
                collection_id: outerCollectionId,
              }
            }
          } else {
            var params = {
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
              sign: '',
            }
            const sign = await nearAccount?.connection.signer.signMessage(Buffer.from(JSON.stringify(params)), nearAccount?.accountId, API_CONFIG().networkId);
            params.sign = base58.encode(sign?.signature!);

            const result = await CreateParasCollection({
              logo: logoFile,
              cover: coverFile,
              args: params
            });

            if (result?.response?.status === 200) {
              res = result.data;

              if (!!res.data.collection_id) {
                setParasCreatedList((list) => {
                  list.push(values?.name);
                  return list;
                });
              }
            }
          }
          break;
        case 'mintbase':
          const logoRes = await mintbaseWallet?.minter?.upload(logoFile!);
          const coverRes = await mintbaseWallet?.minter?.upload(coverFile!);
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
      }

      const args = {
        sign: discordOperationSign,
        user_id: discordInfo?.user_id,
        guild_id: discordInfo?.guild_id,
      }

      const sign = await nearAccount?.connection.signer.signMessage(Buffer.from(JSON.stringify(args)), nearAccount?.accountId, API_CONFIG().networkId);

      const msg = {
        args: args,
        sign: base58.encode(sign?.signature!),
        account_id: nearAccount?.accountId,
      }

      const _sign = await GetOwnerSign(msg);

      if (!discordOperationSign) {
        setErrorState?.(true);
        return;
      }

      // Contract Request
      const contract_args = {
        outer_collection_id: res.collection_id,
        contract_type: selectPlatform,
        guild_id: discordInfo?.guild_id,
        royalty: royalty,
        mintable_roles: values.role_id,
        price: ParseAmount({
          amount: values?.mintPrice,
        }) || "0",
        mint_count_limit: !!values?.mintLimit && parseInt(values?.mintLimit),
        ..._sign
      };

      var callbackUrl: string = "";
      switch (selectPlatform) {
        case 'paras':
          callbackUrl = `${window.location.origin}/serieslist/paras:${outerCollectionId}${location.search}`;
          break;
        case 'mintbase':
          callbackUrl = `${window.location.origin}/serieslist/mintbase:${res.collection_id}${location.search}`
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
          form.resetFields();
          setLogoFile(undefined);
          setCoverFile(undefined);
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
                  rules={[
                    {
                      validator: async () => {
                        if (!logoFile) {
                          throw new Error(intl.formatMessage({
                            id: "collection.create.form.logo.required"
                          }));
                        }
                      }
                    }
                  ]}
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
                        setLogoFile(info?.file?.originFileObj);
                        await getBase64(info?.file?.originFileObj, (url) => {
                          setLogoUrl(url);
                          setLoading(false);
                        });
                        return;
                      }

                      if (info.file.status === 'removed') {
                        setLogoFile(undefined);
                        setLogoUrl('');
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
                        setCoverFile(info?.file?.originFileObj);
                        await getBase64(info?.file?.originFileObj, (url) => {
                          setCoverUrl(url);
                          setLoading(false);
                        });
                        return;
                      }

                      if (info.file.status === 'removed') {
                        setCoverFile(undefined);
                        setCoverUrl('');
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

                    mode='multiple'
                    size='middle'
                    bordered={false}
                    className={styles.select}
                    popupClassName={styles.selectPopup}
                    onChange={() => {

                    }}
                    options={(roleList || []).map((role) => ({
                      label: role.name,
                      value: role.id,
                      key: role.id,
                    }))}
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
