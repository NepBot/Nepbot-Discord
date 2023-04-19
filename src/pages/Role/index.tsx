/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 03:35:39
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 00:31:11
 * @ Description: 
 */


import React, { useCallback, useEffect, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel, useLocation } from '@umijs/max';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { Col, Input, Row, Spin, message, notification } from 'antd';
import querystring from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import ItemCard from './components/ItemCard';
import CreateModal from './components/CreateModal';
import { GetOperationSign, GetOwnerSign, GetRole, GetTxByGuild } from '@/services/api';
import Octopus from '@/assets/collection/octopus.svg';
import Near from '@/assets/collection/near.svg';
import Paras from '@/assets/collection/paras.svg';
import H00KD from '@/assets/collection/h00kd.svg';
import ASTRO from '@/assets/collection/astro.svg';
import { API_CONFIG } from '@/constants/config';
import { IsObjectValueEqual } from '@/utils/request';
import { RequestTransaction } from '@/utils/contract';
import UserLayout from '@/layouts/UserLayout';
import Loading from '@/components/Loading';
import LinkExpired from '@/components/LinkExpired';
import NoData from '@/components/NoData';
import { SignMessage } from '@/utils/near';

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

const Role: React.FC = () => {
  const { nearAccount, nearWallet, GetKeyStore } = useModel('near.account');
  const { discordServer, GetServerInfo } = useModel('discord');
  const { discordInfo, discordOperationSign, setDiscordInfo, setDiscordOperationSign } = useModel('store');
  const [dataSource, setDataSource] = useState<Contract.RuleItem[]>([]);
  const [appchainIds, setAppchainIds] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  const handleData = async (data: Contract.RuleItem[], serverName?: string) => {
    if (!!search && !!discordOperationSign) {
      const roleRes = await GetRole({
        guild_id: search.guild_id!,
      });
      const txRes = await GetTxByGuild({
        guild_id: search.guild_id!,
      });

      const roleList = (roleRes?.data as Resp.GetRole)?.data;
      data?.forEach((item: any, index) => {
        roleList?.forEach(role => {
          if (role.id === item["role_id"]) {
            item.role_name = role.name
            item.guild_name = discordServer?.name || serverName
            item.key = index;
          }
        })
      });
      roleList?.forEach(role => {
        data?.forEach((item, index) => {
          if (role?.id === item["role_id"] && role?.name !== '@everyone' && !!role?.name) {
            item.role_name = role.name
            item.guild_name = discordServer?.name || serverName
            item.key = index;
          }
        });
      });

      for (let item of data) {
        if (!!item?.key_field) {
          switch (item?.key_field[0]) {
            case 'token_id':
              var metadata = await nearAccount?.viewFunction(item.key_field[1], 'ft_metadata', {});
              item.token_symbol = metadata?.symbol;
              item.icon = metadata?.icon;
              item.decimals = metadata?.decimals;
              break;
            case 'appchain_id':
              item.icon = Octopus;
              break;
            case 'near':
              item.icon = Near;
              break;
            case 'nft_contract_id':
              var metadata = await nearAccount?.viewFunction(item?.key_field[1], 'nft_metadata', {});
              item.icon = metadata?.icon;
              item.name = metadata?.name;
              break;
            case API_CONFIG().PARAS_CONTRACT:
              item.icon = Paras;
              item.name = item?.key_field[1];
              break;
            case API_CONFIG().H00KD_CONTRACT:
              try {
                const eventdata = await nearAccount?.viewFunction(API_CONFIG().H00KD_CONTRACT, 'get_event_data', { event_id: item?.key_field[1] });
                item.name = eventdata?.title;
                item.icon = H00KD;
              } catch (e: any) {
                notification.error({
                  key: 'error.viewFunction',
                  message: 'Error',
                  description: e.message,
                });
                console.log(e)
              };
              break;
            case 'astrodao_id':
              item.icon = ASTRO;
              break;
            case 'gating_rule':
              item.icon = Paras;
          }

          const txList = (txRes?.data as Resp.GetTxByGuild)?.data;
          if (!!txList) {
            for (let tx of txList) {
              if (IsObjectValueEqual(item?.fields, tx?.roles?.[0]?.fields) && item?.key_field.join('') === tx?.roles?.[0]?.key_field?.join('') && item.role_id === tx?.roles?.[0]?.role_id) {
                item.transaction_hash = tx.transaction_hash;
              }
            }
          }
        }
      }
    }

    return data;
  };

  const handleDelete = async (record: Contract.RuleItem) => {
    const object = {
      guild_id: record.guild_id,
      role_id: record.role_id,
      key_field: record.key_field,
      fields: record.fields,
    };

    const args = {
      sign: discordOperationSign,
      user_id: search?.user_id,
      guild_id: search?.guild_id,
    };

    const keystore = await GetKeyStore(nearAccount?.accountId);

    if (!keystore) {
      return;
    }

    const signature = await SignMessage({
      keystore: keystore,
      object: args,
    })

    const _sign = await GetOwnerSign({
      args: args,
      sign: signature?.signature,
      account_id: nearAccount?.accountId,
    });

    if (!_sign?.data?.success) {
      notification.error({
        key: 'error.delete',
        message: 'Error',
        description: (_sign?.data as Resp.Error)?.message,
      });
      setErrorState(true);
      setLoading(false);
      return;
    }

    const delRule = await RequestTransaction({
      nearAccount: nearAccount,
      nearWallet: nearWallet,
      contractId: API_CONFIG().RULE_CONTRACT,
      methodName: 'del_roles',
      args: {
        roles: [object],
        ...(_sign?.data as Resp.GetOperationSign)?.data,
      },
      gas: '300000000000000',
      deposit: '0',
    });

    setTimeout(async () => {
      if (!!delRule) {
        const data = await nearAccount?.viewFunction(API_CONFIG().RULE_CONTRACT, 'get_guild', { guild_id: search?.guild_id! });
        const _data = await handleData(data)
        setDataSource(_data);
        messageApi.info('Success');
      }
    });
  };

  useEffect(() => {
    (async () => {
      if (!!search.guild_id && !!search.user_id && !!search.sign) {
        if (!nearAccount) {
          return;
        }

        setLoading(true);
        setDiscordInfo({
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign,
        });

        const args = {
          account_id: nearAccount?.accountId,
          user_id: search?.user_id,
          guild_id: search?.guild_id,
          sign: search?.sign,
          operationSign: discordOperationSign,
        };

        const keystore = await GetKeyStore(nearAccount?.accountId);

        if (!keystore) {
          return;
        };

        const signature = await SignMessage({
          keystore: keystore,
          object: args,
        });

        const _sign = await GetOperationSign({
          args: args,
          account_id: nearAccount?.accountId,
          sign: signature?.signature,
        });

        if (!_sign?.data?.success) {
          notification.error({
            key: 'error.getOperationSign',
            message: 'Error',
            description: (_sign?.data as Resp.Error)?.message,
          });
          setErrorState(true);
          setLoading(false);
          return;
        }

        setDiscordOperationSign((_sign?.data as Resp.GetOperationSign)?.data);
        const server = await GetServerInfo({
          guild_id: search.guild_id,
        });

        const appchainIds = await nearAccount?.viewFunction(API_CONFIG().OCT_CONTRACT, 'get_appchain_ids', {});
        setAppchainIds(appchainIds);

        const data = await nearAccount?.viewFunction(API_CONFIG().RULE_CONTRACT, 'get_guild', { guild_id: search.guild_id });

        const guildData = await handleData(data, server?.name);
        setDataSource(guildData);
        setLoading(false);
      } else {
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: 'Missing parameters',
        });
        setErrorState(true);
        setLoading(false);
      }
    })()
  }, [isModalOpen, nearAccount]);

  return (
    <UserLayout>
      {!errorState && loading && (
        <Loading />
      )}
      {errorState && !loading && (
        <LinkExpired />
      )}
      {!errorState && !loading && (
        <div className={styles.roleContainer}>
          {contextHolder}
          <div className={styles.wrapper}>
            <div className={styles.headerContainer}>
              <div className={styles.searchContainer}>
                <AiOutlineSearch
                  className={styles.searchIcon}
                />
                <Input
                  bordered={false}
                  placeholder={intl.formatMessage({
                    id: 'role.search.placeholder'
                  })}
                  className={styles.searchInput}
                  onChange={async (e) => {
                    if (e.target.value === '') {
                      const data = await nearAccount?.viewFunction(API_CONFIG().RULE_CONTRACT, 'get_guild', { guild_id: search?.guild_id! });
                      const _data = await handleData(data);
                      if (!_data) {
                        return;
                      }
                      setDataSource(_data);
                      return;
                    }
                    const data = await nearAccount?.viewFunction(API_CONFIG().RULE_CONTRACT, 'get_token', { token_id: e.target.value });
                    const _data = await handleData(data);
                    setDataSource(_data);
                  }}
                />
              </div>
              <div className={styles.buttonsContainer}>
                <div
                  className={styles.button}
                  onClick={async () => {
                    setIsModalOpen(true);
                  }}
                >
                  <AiOutlinePlus
                    className={styles.buttonIcon}
                  />
                  {intl.formatMessage({
                    id: 'role.button.add'
                  })}
                </div>
              </div>
            </div>
            <div className={styles.contentContainer}>
              {!!dataSource?.length && (
                <Row gutter={[30, 30]}>
                  {dataSource?.map((item, index) => {
                    return (
                      <Col
                        xs={24} sm={24} md={12} lg={8} xl={8}
                        key={uuidv4()}
                      >
                        <ItemCard
                          item={item}
                          onDelete={() => {
                            handleDelete(item);
                          }}
                        />
                      </Col>
                    )
                  })}
                </Row>
              )}
              {!dataSource?.length && (
                <NoData
                  name='role'
                />
              )}
            </div>
          </div>
          <CreateModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            appchainIds={appchainIds}
            onSubmit={async () => {
              setIsModalOpen(false);
            }}
            onCancel={async () => {
              setIsModalOpen(false);
            }}
          />
        </div>
      )}
    </UserLayout>
  )
};

export default Role;
