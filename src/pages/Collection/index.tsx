/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:47:44
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-24 04:02:23
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import styles from "./style.less";
import { useIntl, history, useLocation, useModel } from "umi";
import { AiFillCloseCircle, AiFillCodeSandboxCircle, AiOutlinePlus } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";
import classNames from "classnames";
import { Col, Row } from "antd";
import querystring from 'query-string';
import ItemCard from "./components/ItemCard";
import { SignMessage } from "@/utils/near";
import { API_CONFIG } from "@/constants/config";
import { GetCollection, GetMintbaseCollection, GetOperationSign, GetRole } from "@/services/api";

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

const Collection: React.FC = () => {
  const { walletSelector, nearAccount, OpenModalWallet } = useModel('near.account');
  const { discordInfo, discordOperationSign, setDiscordInfo, setDiscordOperationSign } = useModel('store');
  const { discordServer, GetUserInfo } = useModel('discord');
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [roleMap, setRoleMap] = useState<Map<string, string>>(new Map());
  const [roleList, setRoleList] = useState<Item.Role[]>();
  const [collectionList, setCollectionList] = useState<Contract.WrappedCollections[]>([]);

  const intl = useIntl();

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!!search?.guild_id && !!search?.user_id && !!search?.sign) {
        var roleList: string[] = [];
        setDiscordInfo({
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign
        });
        const userInfo = await GetUserInfo({
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign
        });
        if (!!userInfo?.roles) {
          roleList = userInfo?.roles;
        } else {
          setErrorState(true);
          return;
        }
      }
    })()
  }, [walletSelector, nearAccount, search]);

  return (
    <div className={styles.collectionContainer}>
      <div className={styles.wrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.title}>
            {intl.formatMessage({
              id: "collection.title"
            })}
          </div>
          <div className={styles.buttonsContainer}>
            <div
              className={styles.button}
              onClick={() => {
                history.push('/collection/create');
              }}
            >
              <AiOutlinePlus
                className={styles.buttonIcon}
              />
              {intl.formatMessage({
                id: 'collection.button.add'
              })}
            </div>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.itemContainer}>
            <div className={styles.itemTitle}>
              <AiFillCheckCircle
                className={classNames(styles.itemTitleIcon, styles.itemTitleIconHaveAccess)}
              />
              {intl.formatMessage({
                id: "collection.item.title.haveAccess"
              })}
            </div>
            <div className={styles.itemContent}>
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
          <div className={styles.itemContainer}>
            <div className={styles.itemTitle}>
              <AiFillCloseCircle
                className={classNames(styles.itemTitleIcon, styles.itemTitleIconNoAccess)}
              />
              {intl.formatMessage({
                id: "collection.item.title.noAccess"
              })}
            </div>
            <div className={styles.itemContent}>
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
          <div className={styles.itemContainer}>
            <div className={styles.itemTitle}>
              <AiFillCodeSandboxCircle
                className={classNames(styles.itemTitleIcon, styles.itemTitleIconMintedOut)}
              />
              {intl.formatMessage({
                id: "collection.item.title.mintedOut"
              })}
            </div>
            <div className={styles.itemContent}>
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
        </div>
      </div>
    </div>
  )
};

export default Collection;
