/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 16:18:09
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 00:17:12
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import { Form, Input, InputNumber, Modal, Select, Spin, message, notification } from 'antd';
import classNames from 'classnames';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { GetOwnerSign, GetRole } from '@/services/api';
import { API_CONFIG } from '@/constants/config';
import { ParseAmount, SignMessage, debounce } from '@/utils/near';
import { base58 } from 'ethers/lib/utils';
import { RequestTransaction } from '@/utils/contract';
import LinkExpired from '@/components/LinkExpired';

const CreateModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appchainIds: any[];
  onSubmit?: () => void;
  onCancel?: () => void;
}> = ({ isModalOpen, setIsModalOpen, appchainIds, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const { nearAccount, nearWallet, GetKeyStore } = useModel('near.account');
  const { discordServer } = useModel('discord');
  const { discordInfo, discordOperationSign } = useModel('store');
  const [roleList, setRoleList] = useState<Item.Role[]>([]);
  const [astroRoleList, setAstroRoleList] = useState<any[]>([]);
  const [type, setType] = useState<string>('');
  const [gatingRule, setGatingRule] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isParas, setIsParas] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);

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

      } else {
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: 'Missing parameters',
        });
        setErrorState(true);
      }
    })()
  }, [isModalOpen, discordInfo]);

  const searchRole = async (v: any) => {
    var res;
    try {
      res = await nearAccount?.viewFunction(v?.target?.value?.trim(), 'get_policy', {});
    } catch (e: any) {
      notification.error({
        key: 'error.params',
        message: 'Error',
        description: e?.message,
      });
    }
    if (!!res && res?.roles && !!res?.roles?.length) {
      setAstroRoleList(res?.roles);
      form.setFieldsValue({ astrodao_role: 'everyone' })
      form.validateFields(['astrodao_id']);
    } else if (!!astroRoleList?.length) {
      setAstroRoleList([])
      form.setFieldsValue({ astrodao_role: 'everyone' })
      form.validateFields(['astrodao_id']);
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = await form.getFieldsValue();
      setLoading(true);
      const arg: any = {
        guild_id: discordServer?.id,
        role_id: values.role,
      };

      switch (type) {
        case 'token_amount':
          const metadata = await nearAccount?.viewFunction(values.token_id, 'ft_metadata', {});
          const amount = ParseAmount({
            amount: values.token_amount,
            decimals: metadata?.decimals,
          });
          arg.key_field = ['token_id', values.token_id];
          arg.fields = { token_amount: amount };
          break;
        case 'oct_roles':
          arg.key_field = ['appchain_id', values.appchain_id];
          arg.fields = { oct_role: values.oct_role };
          break;
        case 'near_balance':
          arg.key_field = ['near', 'balance'];
          arg.fields = {
            balance: ParseAmount({
              amount: values.balance,
            })
          }
          break;
        case 'nft_amount':
          if (values.contract_id === API_CONFIG().PARAS_CONTRACT && values.collection_url && values.collection_url?.trim().length > 0) {
            const fractions = values.collection_url?.split("/");
            const lastFraction = fractions[fractions.length - 1]?.split("?");
            arg.key_field = [API_CONFIG().PARAS_CONTRACT, lastFraction[0]];
            arg.fields = { token_amount: values.token_amount };
          } else {
            await nearAccount?.viewFunction(values.contract_id, 'nft_metadata', {});
            arg.key_field = ['nft_contract_id', values.contract_id];
            arg.fields = { token_amount: values.token_amount };
          }
          break;
        case 'astrodao_roles':
          arg.key_field = ['astrodao_id', values.astrodao_id];
          arg.fields = { astrodao_role: values.astrodao_role };
          break;
        case 'paras':
          arg.key_field = ['gating_rule', values.gating_rule];
          switch (values.gating_rule) {
            case 'loyalty_level':
              arg.fields = { loyalty_level: values.loyalty_level };
              break;
            case 'paras_staking':
              arg.fields = {
                paras_staking_amount: ParseAmount({
                  amount: values.paras_staking_amount,
                  decimals: 18,
                }),
                paras_staking_duration: values.paras_staking_duration,
              };
              break;
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

      const signature = await SignMessage({
        keystore: keystore,
        object: args,
      });

      const _sign = await GetOwnerSign({
        args: args,
        sign: signature?.signature,
        account_id: nearAccount?.accountId,
      });

      const _signData = (_sign?.data as Resp.GetOwnerSign)?.data;

      if (!_sign?.data?.success) {
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: 'Missing parameters',
        });
        setErrorState(true);
        return;
      }

      const data = await RequestTransaction({
        nearAccount: nearAccount,
        nearWallet: nearWallet,
        contractId: API_CONFIG().RULE_CONTRACT,
        methodName: 'set_roles',
        args: {
          roles: [arg],
          ..._signData,
        },
        gas: '300000000000000',
        deposit: '20000000000000000000000',
      });

      setTimeout(() => {
        if (data) {
          setLoading(false);
          form.resetFields();
          onSubmit?.();
        }
      })
    } catch (e: any) {
      notification.warning({
        key: 'error.params',
        message: 'Error',
        description: e.message,
      });
    }
  };

  return (
    <>
      {errorState && (
        <LinkExpired />
      )}
      {!errorState && (
        <Modal
          centered
          open={isModalOpen}
          className={styles.createContainer}
          closable={false}
          footer={null}
        >
          {contextHolder}
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
                      onChange={(value) => {
                        form.setFieldsValue({
                          role: value,
                        });
                      }}
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
                        form.setFieldsValue({
                          type: value,
                        });
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
                          onChange={(value) => {
                            form.setFieldsValue({
                              appchain_id: value,
                            });
                          }}
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
                          onChange={(value) => {
                            form.setFieldsValue({
                              oct_role: value,
                            });
                          }}
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
                          onChange={(value) => {
                            form.setFieldsValue({
                              astrodao_role: value
                            });
                          }}
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
                            form.setFieldsValue({
                              gating_rule: value
                            });
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
                              onChange={(value) => {
                                form.setFieldsValue({
                                  loyalty_level: value
                                });
                              }}
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
                        try {
                          form.submit();
                          await handleSubmit();
                          setIsModalOpen(true);
                          setLoading(true);
                          messageApi.success('Success');
                          onSubmit?.();
                        } catch (e: any) {
                          notification.error({
                            key: 'error.role-create',
                            message: 'Error',
                            description: e.message,
                          });
                        }
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
      )}
    </>
  );
};

export default CreateModal;
