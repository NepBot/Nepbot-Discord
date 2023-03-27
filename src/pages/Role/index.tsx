/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 03:35:39
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-28 04:34:47
 * @ Description: i@rua.moe
 */


import React, { useCallback, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel } from '@umijs/max';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { Col, Input, Row, notification } from 'antd';
import ItemCard from './components/ItemCard';
import CreateModal from './components/CreateModal';
import { GetRole, GetTxByGuild } from '@/services/api';
import Octopus from '@/assets/collection/octopus.svg';
import Near from '@/assets/collection/near.svg';
import Paras from '@/assets/collection/paras.svg';
import H00KD from '@/assets/collection/h00kd.svg';
import ASTRO from '@/assets/collection/astro.svg';
import { API_CONFIG } from '@/constants/config';
import { IsObjectValueEqual } from '@/utils/request';

interface RoleProps {
  fields?: any[];
  key_field?: string[];
  token_symbol?: string;
  icon?: string;
  name?: string;
  decimals?: number;
  transaction_hash?: string;
  role_name?: string;
  role_id?: string;
  guild_name?: string;
  key?: number;
}

const Role: React.FC = () => {
  const { walletSelector, nearAccount } = useModel('near.account');
  const { discordServer } = useModel('discord');
  const { discordInfo, discordOperationSign, setDiscordInfo, setDiscordOperationSign } = useModel('store');
  const [roleList, setRoleList] = useState<RoleProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const intl = useIntl();

  const handleData = useCallback(async (data: RoleProps[], serverName?: string) => {
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

  return (
    <div className={styles.roleContainer}>
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
            />
          </div>
          <div className={styles.buttonsContainer}>
            <div
              className={styles.button}
              onClick={() => setIsModalOpen(true)}
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
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <ItemCard />
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <ItemCard />
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <ItemCard />
            </Col>
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
