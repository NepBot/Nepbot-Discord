/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 16:18:09
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-29 04:38:00
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import { Form, Input, InputNumber, Modal, Select, Spin, message } from 'antd';
import classNames from 'classnames';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { GetRole } from '@/services/api';
import { API_CONFIG } from '@/constants/config';
import { debounce } from '@/utils/near';

const CreateModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appchainIds: any[];
  onSubmit?: () => void;
  onCancel?: () => void;
}> = ({ isModalOpen, setIsModalOpen, appchainIds, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const { discordServer } = useModel('discord');
  const { discordInfo, discordOperationSign } = useModel('store');
  const [roleList, setRoleList] = useState<Item.Role[]>([]);
  const [astroRoleList, setAstroRoleList] = useState<any[]>([]);
  const [type, setType] = useState<string>('');
  const [gatingRule, setGatingRule] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isParas, setIsParas] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const intl = useIntl();

  useEffect(() => {
    (async () => {
      if (!isModalOpen) return;
      if (!!discordInfo?.guild_id) {
        const roles = await GetRole({
          guild_id: discordInfo?.guild_id,
        });
        if (roles?.data?.success) {
          setRoleList((roles?.data as Resp.GetRole)?.data!);
        }
      }
    })()
  }, [isModalOpen, discordInfo]);

  const searchRole = async (v) => {

  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = await form.getFieldsValue();
      setLoading(true);
      const args = {
        guild_id: discordServer?.id,
        role_id: values.role,
      };
    } catch (e: any) {

    }
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      className={styles.createContainer}
      closable={false}
      footer={null}
    >
      <div className={styles.wrapper}>
        <div className={styles.contentContainer}>
          <Form
            form={form}
            name="createCollection"
            autoComplete="off"
            labelWrap={true}
            layout="vertical"
            className={styles.formContainer}
          >
            <Form.Item
              label={
                <div className={styles.formItemLabel}>
                  {intl.formatMessage({
                    id: "role.create.form.label.role"
                  })}
                </div>
              }
              name="role"
              className={styles.formItem}
              rules={[{
                required: true,
                message: intl.formatMessage({
                  id: "role.create.form.label.role.required"
                })
              }]}
            >
              <div className={styles.formItemInputContainer}>
                <Select
                  allowClear
                  showSearch
                  size='middle'
                  bordered={false}
                  className={styles.select}
                  popupClassName={styles.selectPopup}
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
                <div className={styles.formItemLabel}>
                  {intl.formatMessage({
                    id: "role.create.form.label.type"
                  })}
                </div>
              }
              name="type"
              className={styles.formItem}
              rules={[{
                required: true,
                message: intl.formatMessage({
                  id: "role.create.form.label.type.required"
                })
              }]}
            >
              <div className={styles.formItemInputContainer}>
                <Select
                  allowClear
                  showSearch
                  size='middle'
                  bordered={false}
                  className={styles.select}
                  popupClassName={styles.selectPopup}
                  onChange={(value) => {
                    setType(value as string);
                  }}
                  options={[
                    {
                      key: 'token_amount',
                      value: 'token_amount',
                      label: 'Token amount',
                    },
                    {
                      key: 'oct_roles',
                      value: 'oct_roles',
                      label: 'OCT roles',
                    },
                    {
                      key: 'near_balance',
                      value: 'near_balance',
                      label: 'NEAR balance',
                    },
                    {
                      key: 'nft_amount',
                      value: 'nft_amount',
                      label: 'NFT amount',
                    },
                    {
                      key: 'astrodao_roles',
                      value: 'astrodao_roles',
                      label: 'AstroDAO roles',
                    },
                    {
                      key: 'paras',
                      value: 'paras',
                      label: 'Paras',
                    }
                  ]}
                />
              </div>
            </Form.Item>
            {type === 'token_amount' && (
              <>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.tokenContract.label"
                      })}
                    </div>
                  }
                  name="token_id"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.tokenContract.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Input
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "role.create.form.tokenContract.placeholder"
                      })}
                      className={styles.formItemInput}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.tokenAmount.label"
                      })}
                    </div>
                  }
                  name="token_amount"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.tokenAmount.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <InputNumber
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "role.create.form.tokenAmount.placeholder"
                      })}
                      className={styles.formItemInput}
                      type='number'
                      controls={false}
                      min={1}
                    />
                  </div>
                </Form.Item>
              </>
            )}
            {type === 'oct_roles' && (
              <>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.appchainId.label"
                      })}
                    </div>
                  }
                  name="appchain_id"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.appchainId.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Select
                      allowClear
                      showSearch
                      size='middle'
                      bordered={false}
                      className={styles.select}
                      popupClassName={styles.selectPopup}
                      options={(appchainIds || []).map((item) => ({
                        label: item,
                        value: item,
                        key: item,
                      }))}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.octRole.label"
                      })}
                    </div>
                  }
                  name="oct_role"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.octRole.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Select
                      allowClear
                      showSearch
                      size='middle'
                      bordered={false}
                      className={styles.select}
                      popupClassName={styles.selectPopup}
                      options={[
                        {
                          key: 'delegator',
                          value: 'delegator',
                          label: 'Delegator',
                        },
                        {
                          key: 'validator',
                          value: 'validator',
                          label: 'Validator',
                        },
                      ]}
                    />
                  </div>
                </Form.Item>
              </>
            )}
            {type === 'near_balance' && (
              <>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.balance.label"
                      })}
                    </div>
                  }
                  name="balance"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.balance.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <InputNumber
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "role.create.form.balance.placeholder"
                      })}
                      className={styles.formItemInput}
                      type='number'
                      controls={false}
                      min={1}
                    />
                  </div>
                </Form.Item>
              </>
            )}
            {type === 'nft_amount' && (
              <>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.contractId.label"
                      })}
                    </div>
                  }
                  name="contract_id"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.contractId.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Input
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "role.create.form.contractId.placeholder"
                      })}
                      className={styles.formItemInput}
                      onChange={(e) => {
                        setIsParas(e?.target?.value === API_CONFIG().PARAS_CONTRACT);
                      }}
                    />
                  </div>
                </Form.Item>
                {isParas && (
                  <Form.Item
                    label={
                      <div className={styles.formItemLabel}>
                        {intl.formatMessage({
                          id: "role.create.form.collectionUrl.label"
                        })}
                      </div>
                    }
                    name="collection_url"
                    rules={[{
                      required: true,
                      message: intl.formatMessage({
                        id: "role.create.form.collectionUrl.required"
                      })
                    }]}
                    className={styles.formItem}
                  >
                    <div className={styles.formItemInputContainer}>
                      <Input
                        bordered={false}
                        placeholder={intl.formatMessage({
                          id: "role.create.form.collectionUrl.placeholder"
                        })}
                        className={styles.formItemInput}
                      />
                    </div>
                  </Form.Item>
                )}
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.amount.label"
                      })}
                    </div>
                  }
                  name="amount"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.amount.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <InputNumber
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "role.create.form.amount.placeholder"
                      })}
                      className={styles.formItemInput}
                      type='number'
                      controls={false}
                      min={1}
                    />
                  </div>
                </Form.Item>
              </>
            )}
            {type === 'astrodao_roles' && (
              <>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.astrodaoID.label"
                      })}
                    </div>
                  }
                  name="astrodao_id"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.astrodaoID.required"
                    })
                  }, {
                    validator: async (_, value) => {
                      if (astroRoleList.length == 0 && value.trim()) {
                        return Promise.reject("That DAO contract doesn't exist");
                      }
                      return Promise.resolve();
                    }
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Input
                      bordered={false}
                      placeholder={intl.formatMessage({
                        id: "role.create.form.astrodaoID.placeholder"
                      })}
                      className={styles.formItemInput}
                      onChange={async (e) => {
                        debounce(searchRole, 500)(e?.target?.value);
                      }}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.astrodaoRole.label"
                      })}
                    </div>
                  }
                  name="astrodao_role"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.astrodaoRole.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Select
                      allowClear
                      showSearch
                      size='middle'
                      bordered={false}
                      className={styles.select}
                      popupClassName={styles.selectPopup}
                      defaultValue={'everyone'}
                      options={[
                        {
                          key: 'everyone',
                          value: 'everyone',
                          label: 'everyone',
                        },
                        ...astroRoleList.map((role) => ({
                          key: role?.name,
                          value: role?.name,
                          label: role?.name,
                        }))
                      ]}
                    />
                  </div>
                </Form.Item>
              </>
            )}
            {type === 'paras' && (
              <>
                <Form.Item
                  label={
                    <div className={styles.formItemLabel}>
                      {intl.formatMessage({
                        id: "role.create.form.gatingRule.label"
                      })}
                    </div>
                  }
                  name="gating_rule"
                  rules={[{
                    required: true,
                    message: intl.formatMessage({
                      id: "role.create.form.gatingRule.required"
                    })
                  }]}
                  className={styles.formItem}
                >
                  <div className={styles.formItemInputContainer}>
                    <Select
                      allowClear
                      showSearch
                      size='middle'
                      bordered={false}
                      className={styles.select}
                      popupClassName={styles.selectPopup}
                      onChange={(value) => {
                        setGatingRule(value);
                      }}
                      options={[
                        {
                          key: 'loyalty_level',
                          value: 'loyalty_level',
                          label: 'Loyalty Level',
                        },
                        {
                          key: 'paras_staking',
                          value: 'paras_staking',
                          label: 'Paras Staking',
                        }
                      ]}
                    />
                  </div>
                </Form.Item>
                {gatingRule === 'loyalty_level' && (
                  <>
                    <Form.Item
                      label={
                        <div className={styles.formItemLabel}>
                          {intl.formatMessage({
                            id: "role.create.form.loyaltyLevel.label"
                          })}
                        </div>
                      }
                      name="loyalty_level"
                      rules={[{
                        required: true,
                        message: intl.formatMessage({
                          id: "role.create.form.gatingRule.required"
                        })
                      }]}
                      className={styles.formItem}
                    >
                      <div className={styles.formItemInputContainer}>
                        <Select
                          allowClear
                          showSearch
                          size='middle'
                          bordered={false}
                          className={styles.select}
                          popupClassName={styles.selectPopup}
                          options={[
                            {
                              key: 'Bronze',
                              value: 'Bronze',
                              label: 'Bronze',
                            },
                            {
                              key: 'Silver',
                              value: 'Silver',
                              label: 'Silver',
                            },
                            {
                              key: 'Gold',
                              value: 'Gold',
                              label: 'Gold',
                            },
                            {
                              key: 'Platinum',
                              value: 'Platinum',
                              label: 'Platinum',
                            },
                            {
                              key: 'All',
                              value: 'All',
                              label: 'All',
                            }
                          ]}
                        />
                      </div>
                    </Form.Item>
                  </>
                )}
                {gatingRule === 'paras_staking' && (
                  <>
                    <Form.Item
                      label={
                        <div className={styles.formItemLabel}>
                          {intl.formatMessage({
                            id: "role.create.form.amount.label"
                          })}
                        </div>
                      }
                      name="paras_staking_amount"
                      rules={[{
                        required: true,
                        message: intl.formatMessage({
                          id: "role.create.form.amount.required"
                        })
                      }, {
                        validator: async (_, value) => {
                          if (!!value && value > 0 && value % 1 == 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Amount must be an integer greater than 0');
                        }
                      }]}
                      className={styles.formItem}
                    >
                      <div className={styles.formItemInputContainer}>
                        <InputNumber
                          bordered={false}
                          placeholder={intl.formatMessage({
                            id: "role.create.form.amount.placeholder"
                          })}
                          className={styles.formItemInput}
                          type='number'
                          controls={false}
                          min={1}
                        />
                      </div>
                    </Form.Item>
                    <Form.Item
                      label={
                        <div className={styles.formItemLabel}>
                          {intl.formatMessage({
                            id: "role.create.form.duration.label"
                          })}
                        </div>
                      }
                      name="paras_staking_duration"
                      rules={[{
                        required: true,
                        message: intl.formatMessage({
                          id: "role.create.form.duration.required"
                        })
                      }, {
                        validator: async (_, value) => {
                          if (!!value && value > 0 && value % 1 == 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Amount must be an integer greater than 0');
                        }
                      }]}
                      className={styles.formItem}
                    >
                      <div className={styles.formItemInputContainer}>
                        <InputNumber
                          bordered={false}
                          placeholder={intl.formatMessage({
                            id: "role.create.form.duration.placeholder"
                          })}
                          className={styles.formItemInput}
                          type='number'
                          controls={false}
                          min={1}
                        />
                      </div>
                    </Form.Item>
                  </>
                )}
              </>
            )}
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
                  id: 'role.create.form.button.cancel'
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
                    id: 'role.create.form.button.ok'
                  })
                )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default CreateModal;
