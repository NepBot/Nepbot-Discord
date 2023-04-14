/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:47:44
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-13 04:11:25
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import styles from "./style.less";
import { useIntl, useLocation, useModel } from "umi";
import { AiFillCloseCircle, AiFillCodeSandboxCircle } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";
import classNames from "classnames";
import { Col, Row, notification } from "antd";
import querystring from 'query-string';
import ItemCard from "./components/ItemCard";
import { API_CONFIG } from "@/constants/config";
import { GetCollection, GetMintbaseCollection, GetOperationSign, GetRole } from "@/services/api";
import UserLayout from "@/layouts/UserLayout";
import Mint from "./components/Mint";
import { v4 as uuidv4 } from 'uuid';
import Loading from "@/components/Loading";
import LinkExpired from "@/components/LinkExpired";
import { SignMessage } from "@/utils/near";
import NoData from "@/components/NoData";
import Success from "@/components/Success";

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
  state?: string;
}

const Collection: React.FC = () => {
  const { nearAccount, GetKeyStore } = useModel('near.account');
  const { GetServerInfo, GetUserInfo } = useModel('discord');
  const { discordInfo, discordOperationSign, setDiscordInfo, setDiscordOperationSign } = useModel('store');
  const [errorState, setErrorState] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleMap, setRoleMap] = useState<Map<string, string>>(new Map());
  const [haveAccessList, setHaveAccessList] = useState<Contract.WrappedCollections[]>([]);
  const [noAccessList, setNoAccessList] = useState<Contract.WrappedCollections[]>([]);
  const [mintedOutList, setMintedOutList] = useState<Contract.WrappedCollections[]>([]);
  const [selectItem, setSelectItem] = useState<Contract.WrappedCollections>();
  const [mintModal, setMintModal] = useState<boolean>(false);

  const intl = useIntl();

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!nearAccount) {
        return;
      }

      if (search?.state === 'success') {
        setSuccessState(true);
        setLoading(false);
        return;
      }

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
          setLoading(false);
          return;
        }

        const args = {
          account_id: nearAccount?.accountId,
          user_id: search.user_id,
          guild_id: search.guild_id,
          sign: search.sign,
          opoperationSign: discordOperationSign,
        };

        const keystore = await GetKeyStore(nearAccount?.accountId);

        if (!keystore) {
          return;
        }

        const signature = await SignMessage({
          keystore: keystore,
          object: args,
        })

        const _sign = await GetOperationSign({
          account_id: nearAccount?.accountId,
          sign: signature?.signature,
          args: args,
        });

        if (!_sign?.data?.success) {
          setErrorState(true);
          setLoading(false);
          notification.error({
            key: 'error.sign',
            message: 'Error',
            description: (_sign?.data as Resp.Error)?.message || 'Failed to get sign',
          });
          return;
        }
        setDiscordOperationSign((_sign?.data as Resp.GetOperationSign)?.data);
        await GetServerInfo({
          guild_id: search.guild_id,
        });
        await handleData(roleList);
      } else {
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: 'Missing parameters',
        });
        setErrorState(true);
        setLoading(false);
      }
    })();
  }, [nearAccount]);

  const handleData = async (roleList: string[]) => {
    if (!!discordInfo?.guild_id) {
      setLoading(true);
      const roles = await GetRole({
        guild_id: discordInfo?.guild_id,
      });
      if (roles?.response?.status !== 200 || !(roles?.data as Resp.GetRole)?.data) {
        notification.error({
          key: 'error.roles',
          message: 'Error',
          description: 'Failed to get roles',
        });
        return;
      }

      (roles?.data as Resp.GetRole)?.data?.forEach((item: any) => {
        if (item.name !== '@everyone') {
          setRoleMap((roleMap) => roleMap.set(item.id, item.name));
        }
      });
      var collections: any[] = [];
      try {
        collections = await nearAccount?.viewFunction(API_CONFIG().NFT_CONTRACT, 'get_collections_by_guild', {
          guild_id: discordInfo?.guild_id,
        });
      } catch (e: any) {
        console.log(e);
      }

      for (let collection of collections) {
        var royaltyTotal: number = 0;
        if (!!collection.royalty) {
          Object.keys(collection.royalty).forEach(key => {
            royaltyTotal += Number(collection.royalty[key]);
          });
        }

        var collectionData: any;
        var collectionItems: Contract.WrappedCollections = {};

        switch (collection?.contract_type) {
          case 'paras':
            const ParasRes = await GetCollection({
              collection_id: collection?.outer_collection_id,
            });
            collectionData = (ParasRes?.data as Resp.GetCollection)?.data;
            if (!!collectionData && !!collectionData?.results?.length) {
              collectionItems = {
                name: collection?.collection_id?.split(":")[1]?.split("-guild-")[0]?.replaceAll("-", " "),
                cover: API_CONFIG().IPFS + collectionData?.results[0]['cover'],
                media: API_CONFIG().IPFS + collectionData?.results[0]['media'],
                contract: API_CONFIG().PARAS_CONTRACT,
                royaltyTotal: royaltyTotal / 100,
                inner_collection_id: collection?.collection_id,
                outer_collection_id: collection?.outer_collection_id,
                ...collection,
                ...collectionData?.results[0],
              }
            }
            break;
          case 'mintbase':
            const mintbaseRes = await GetMintbaseCollection({
              collection_id: collection?.outer_collection_id,
            });
            collectionData = (mintbaseRes?.data as Resp.GetMintbaseCollection)?.metadata;
            collectionItems = {
              royaltyTotal: royaltyTotal / 100,
              inner_collection_id: collection.collection_id,
              outer_collection_id: collection.outer_collection_id,
              media: collectionData?.logo,
              cover: collectionData?.background,
              ...collection,
              ...collectionData,
            }
        }

        const collectionInfo = await nearAccount?.viewFunction(API_CONFIG().NFT_CONTRACT, "get_collection", { collection_id: collection.collection_id });
        collectionItems = {
          ...collectionItems,
          creator: collectionInfo.creator_id,
          minted_count: collectionInfo.minted_count,
          total_copies: collectionInfo.total_copies,
        }

        if (!!collectionItems?.minted_count && !!collectionItems?.total_copies && collectionItems?.minted_count >= collectionItems?.total_copies) {
          setMintedOutList((mintedOutList) => [...mintedOutList, collectionItems]);
        } else if (!collectionItems.mintable_roles || (collectionItems.mintable_roles && Array.from(new Set([...collectionItems.mintable_roles, ...roleList])).length < collectionItems.mintable_roles.length + roleList.length)) {
          setHaveAccessList((haveAccessList) => [...haveAccessList, collectionItems]);
        } else {
          setNoAccessList((noAccessList) => [...noAccessList, collectionItems]);
        }
      }
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      {!errorState && !successState && loading && (
        <Loading />
      )}
      {errorState && !successState && !loading && (
        <LinkExpired />
      )}
      {!errorState && successState && !loading && (
        <Success
          from="mint"
          contract_type="Paras"
        />
      )}
      {!errorState && !successState && !loading && (
        <>
          {!mintModal && (
            <div className={styles.collectionContainer}>
              <div className={styles.wrapper}>
                <div className={styles.headerContainer}>
                  <div className={styles.title}>
                    {intl.formatMessage({
                      id: "collection.title"
                    })}
                  </div>
                </div>
                <div className={styles.contentContainer}>
                  {!!haveAccessList?.length && (
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
                          {haveAccessList?.map((item: Contract.WrappedCollections, index: number) => {
                            return (
                              <Col
                                xs={24} sm={24} md={12} lg={8} xl={8}
                                key={uuidv4()}
                              >
                                <ItemCard
                                  item={item}
                                  roleMap={roleMap}
                                  onClick={() => {
                                    setSelectItem(item);
                                    setMintModal(true);
                                  }}
                                />
                              </Col>
                            )
                          })}
                        </Row>
                      </div>
                    </div>
                  )}
                  {!!mintedOutList?.length && (
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
                          {noAccessList?.map((item: Contract.WrappedCollections, index: number) => {
                            return (
                              <Col
                                xs={24} sm={24} md={12} lg={8} xl={8}
                                key={uuidv4()}
                              >
                                <ItemCard
                                  item={item}
                                  roleMap={roleMap}
                                />
                              </Col>
                            )
                          })}
                        </Row>
                      </div>
                    </div>
                  )}
                  {!!mintedOutList?.length && (
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
                          {mintedOutList?.map((item: Contract.WrappedCollections, index: number) => {
                            return (
                              <Col
                                xs={24} sm={24} md={12} lg={8} xl={8}
                                key={uuidv4()}
                              >
                                <ItemCard
                                  item={item}
                                  roleMap={roleMap}
                                />
                              </Col>
                            )
                          })}
                        </Row>
                      </div>
                    </div>
                  )}
                  {!haveAccessList?.length && !mintedOutList?.length && !noAccessList?.length && (
                    <NoData
                      name='collection'
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {mintModal && (
            <Mint
              item={selectItem}
              onCancel={() => {
                setMintModal(false);
              }}
            />
          )}
        </>
      )}
    </UserLayout>
  )
};

export default Collection;
