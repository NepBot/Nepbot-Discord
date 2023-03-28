/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 03:35:39
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-28 18:29:11
 * @ Description: i@rua.moe
 */


import React, { useCallback, useEffect, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel, useLocation } from '@umijs/max';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { Col, Input, Row, message, notification } from 'antd';
import querystring from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import ItemCard from './components/ItemCard';
import CreateModal from './components/CreateModal';
import { GetOperationSign, GetRole, GetTxByGuild } from '@/services/api';
import Octopus from '@/assets/collection/octopus.svg';
import Near from '@/assets/collection/near.svg';
import Paras from '@/assets/collection/paras.svg';
import H00KD from '@/assets/collection/h00kd.svg';
import ASTRO from '@/assets/collection/astro.svg';
import { API_CONFIG } from '@/constants/config';
import { IsObjectValueEqual } from '@/utils/request';
import { base58 } from 'ethers/lib/utils';
import { RequestTransaction } from '@/utils/contract';

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

const Role: React.FC = () => {
  const { walletSelector, nearAccount, nearWallet } = useModel('near.account');
  const { discordServer, discordUser, GetServerInfo } = useModel('discord');
  const { discordInfo, discordOperationSign, setDiscordInfo, setDiscordOperationSign } = useModel('store');
  const [roleList, setRoleList] = useState<Contract.RuleItem[]>([]);
  const [dataSource, setDataSource] = useState<Contract.RuleItem[]>([]);
  const [appchainIds, setAppchainIds] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  const handleData = useCallback(async (data: Contract.RuleItem[], serverName?: string) => {
    if (!!discordInfo && !!discordOperationSign) {
      const roleRes = await GetRole({
        guild_id: discordInfo.guild_id!,
      });
      const txRes = await GetTxByGuild({
        guild_id: discordInfo.guild_id!,
      });

      if (!!roleRes?.data && roleRes?.data?.success) {
        const roleData = roleRes?.data as Resp.GetRole;
        data?.forEach((item: any, index) => {
          roleData?.data?.forEach(role => {
            if (role.id === item["role_id"]) {
              item.role_name = role.name
              item.guild_name = discordServer?.name || serverName
              item.key = index;
            }
          })
        });
        roleData?.data?.forEach(role => {
          data?.forEach((item, index) => {
            if (role?.id === item["role_id"] && role?.name !== '@everyone' && !!role?.name) {
              item.role_name = role.name
              item.guild_name = discordServer?.name || serverName
              item.key = index;
            }
          });
        });

        for (let item of data) {
          if (!!!!item?.key_field) {
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
                  item.name = eventdata?.name;
                  item.icon = H00KD;
                } catch (e: any) {
                  notification.error({
                    key: 'error.viewFunction',
                    message: 'Error',
                    description: e.message,
                  });
                };
                break;
              case 'astrodao_id':
                item.icon = ASTRO;
                break;
              case 'gating_rule':
                item.icon = Paras;
            }

            if (txRes?.data?.success && !!(txRes?.data as Resp.GetTxByGuild)?.data) {
              for (let tx of (txRes?.data as Resp.GetTxByGuild)?.data!) {
                if (IsObjectValueEqual(item?.fields, tx?.roles?.[0]?.fields) && item?.key_field.join('') === tx?.roles?.[0]?.key_field?.join('') && item.role_id === tx?.roles?.[0]?.role_id) {
                  item.transaction_hash = tx.transaction_hash;
                }
              }
            }
          }
        }
      }
    }

    return data;
  }, []);

  const handleDelete = useCallback(async (record: Contract.RuleItem) => {
    const object = {
      guild_id: record.guild_id,
      role_id: record.role_id,
      key_field: record.key_field,
      fields: record.fields,
    };
    const args = {
      sign: discordOperationSign,
      user_id: discordInfo?.user_id,
      guild_id: discordInfo?.guild_id,
    };

    const signature = await nearAccount?.connection.signer.signMessage(Buffer.from(JSON.stringify(args)), nearAccount?.accountId, API_CONFIG().networkId);

    const _sign = await GetOperationSign({
      args: args,
      sign: base58.encode(signature?.signature!),
      account_id: nearAccount?.accountId,
    });

    if (!_sign?.data?.success) {
      notification.error({
        key: 'error.delete',
        message: 'Error',
        description: (_sign?.data as Resp.Error)?.message,
      });
      setErrorState(true);
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
        const data = await nearAccount?.viewFunction(API_CONFIG().RULE_CONTRACT, 'get_guild', { guild_id: discordInfo?.guild_id! });
        const _data = await handleData(data)
        setDataSource(_data);
        message.info('Success');
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (!!search.guild_id && !!search.user_id && !!search.sign) {
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

        const signature = await nearAccount?.connection.signer.signMessage(Buffer.from(JSON.stringify(args)), nearAccount?.accountId, API_CONFIG().networkId);

        const res = await GetOperationSign({
          args: args,
          account_id: nearAccount?.accountId,
          sign: base58.encode(signature?.signature!),
        });

        if (!res?.data?.success) {
          notification.error({
            key: 'error.getOperationSign',
            message: 'Error',
            description: (res?.data as Resp.Error)?.message,
          });
          setErrorState(true);
          return;
        }

        setDiscordOperationSign((res?.data as Resp.GetOperationSign)?.data);
        const server = await GetServerInfo({
          guild_id: search.guild_id,
        });
        const appchainIds = await nearAccount?.viewFunction(API_CONFIG().OCT_CONTRACT, 'get_appchain_ids', {});
        setAppchainIds(appchainIds);

        const data = await nearAccount?.viewFunction(API_CONFIG().RULE_CONTRACT, 'get_guild', { guild_id: search.guild_id });

        const guildData = await handleData(data, server?.name);
        setDataSource(guildData);
      } else {
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: 'Missing parameters',
        });
        setErrorState(true);
      }
    })()
  }, [isModalOpen, walletSelector, discordServer, discordUser, nearAccount, nearWallet]);

  return (
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
          <Row gutter={[30, 30]}>
            {!!dataSource?.length && dataSource?.map((item, index) => {
              return (
                <Col
                  xs={24} sm={24} md={12} lg={8} xl={8}
                  key={uuidv4()}
                >
                  <ItemCard
                    item={item}
                    onDelete={async () => {
                      await handleDelete(item);
                    }}
                  />
                </Col>
              )
            })}
          </Row>
        </div>
      </div>
      <CreateModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  )
};

export default Role;
