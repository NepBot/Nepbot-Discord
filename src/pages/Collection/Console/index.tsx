/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:47:44
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-07 03:41:11
 * @ Description: 
 */

import React, { useEffect, useState } from "react";
import styles from "./style.less";
import { useIntl, useLocation, useModel, history } from "@umijs/max";
import { AiOutlinePlus } from "react-icons/ai";
import { Col, Row, notification } from "antd";
import querystring from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import ItemCard from "../components/ItemCard";
import { API_CONFIG } from "@/constants/config";
import { GetCollection, GetMintbaseCollection, GetOperationSign, GetRole } from "@/services/api";
import SelectPlatform from "@/components/SelectPlatform";
import Create from "./Create";
import UserLayout from "@/layouts/UserLayout";
import { SignMessage } from "@/utils/near";
import Loading from "@/components/Loading";
import LinkExpired from "@/components/LinkExpired";

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

const Collection: React.FC = () => {
  const { nearAccount, GetKeyStore } = useModel('near.account');
  const { discordInfo, discordOperationSign, setDiscordInfo, setDiscordOperationSign } = useModel('store');
  const { GetServerInfo } = useModel('discord');
  const [selectPlatformModal, setSelectPlatformModal] = useState<boolean>(false);
  const [addCollectionModal, setAddCollectionModal] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleMap, setRoleMap] = useState<Map<string, string>>(new Map());
  const [roleList, setRoleList] = useState<Item.Role[]>();
  const [collectionList, setCollectionList] = useState<Contract.WrappedCollections[]>([]);
  const [selectPlatform, setSelectPlatform] = useState<string>();

  const intl = useIntl();

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!nearAccount) {
        return;
      }

      if (!!search?.guild_id && !!search?.user_id && !!search?.sign) {
        setDiscordInfo({
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign,
        });

        const args = {
          account_id: nearAccount?.accountId,
          user_id: search.user_id,
          guild_id: search.guild_id,
          sign: search.sign,
          operationSign: discordOperationSign
        }

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
          setErrorState(true);
          setLoading(false);
          notification.error({
            key: 'error.params',
            message: 'Error',
            description: (_sign?.data as Resp.Error)?.message,
          });
          return;
        }
        setDiscordOperationSign((_sign?.data as Resp.GetOperationSign)?.data);
        await GetServerInfo({
          guild_id: search.guild_id,
        });
        await handleData();
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
  }, [nearAccount]);

  const handleData = async () => {
    if (!!search?.guild_id) {
      setLoading(true);
      try {
        const roles = await GetRole({
          guild_id: search?.guild_id,
        });
        if (!(roles?.data as Resp.GetRole)?.success) {
          setErrorState(true);
          setLoading(false);
          notification.error({
            key: 'error.getRole',
            message: 'Error',
            description: (roles?.data as Resp.Error)?.message,
          });
          return;
        }

        (roles?.data as Resp.GetRole)?.data?.forEach((item: any) => {
          if (item.name !== '@everyone') {
            setRoleMap((roleMap) => roleMap.set(item.id, item.name));
          }
        });
        setRoleList((roles?.data as Resp.GetRole)?.data?.filter((item) => item.name !== '@everyone'));
        const collections = await nearAccount?.viewFunction(API_CONFIG().NFT_CONTRACT, 'get_collections_by_guild', {
          guild_id: search?.guild_id,
        });

        var wrappedCollections: Contract.WrappedCollections[] = [];
        for (let collection of collections) {
          var royaltyTotal: number = 0;
          if (!!collection.royalty) {
            Object.keys(collection.royalty).forEach(key => {
              royaltyTotal += Number(collection.royalty[key]);
            });
          }
          var collectionData: any;
          switch (collection?.contract_type) {
            case 'paras':
              collectionData = await GetCollection({
                collection_id: collection?.outer_collection_id,
              });
              if (!!collectionData?.data && !!(collectionData?.data as Resp.GetCollection)?.data?.results?.length) {
                wrappedCollections.push({
                  royaltyTotal: royaltyTotal / 100,
                  inner_collection_id: collection.collection_id,
                  outer_collection_id: collection.outer_collection_id,
                  ...collection,
                  ...(collectionData?.data as Resp.GetCollection)?.data?.results![0],
                });
              }
              break;
            case 'mintbase':
              collectionData = await GetMintbaseCollection({
                collection_id: collection?.outer_collection_id,
              });
              console.log(collectionData)
              if (!!collectionData) {
                wrappedCollections.push({
                  royaltyTotal: royaltyTotal / 100,
                  inner_collection_id: collection.collection_id,
                  outer_collection_id: collection.outer_collection_id,
                  ...collection,
                  ...collectionData?.data.metadata,
                })
              }
              break;
          }
        }

        setCollectionList(wrappedCollections);

        const result: Contract.WrappedCollections[] = [];
        for (var i = 0; i < wrappedCollections.length; i++) {
          const item = wrappedCollections[i];
          const collection_id = item['inner_collection_id'];
          const collectionInfo = await nearAccount?.viewFunction(API_CONFIG().NFT_CONTRACT, "get_collection", { collection_id: collection_id })
          item.creator = collectionInfo?.creator_id;
          item.minted_count = collectionInfo?.minted_count;
          item.total_copies = collectionInfo?.total_copies;
          item.updated = true;
          result.push(item);
        }
        console.log(result)
        setCollectionList(result);
      } catch (error: any) {
        console.log(error);
      }
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
  };

  return (
    <UserLayout>
      {!errorState && loading && !selectPlatformModal && !addCollectionModal && (
        <Loading />
      )}
      {errorState && !loading && !selectPlatformModal && !addCollectionModal && (
        <LinkExpired />
      )}
      {!errorState && !loading && !selectPlatformModal && !addCollectionModal && (
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
                    setSelectPlatformModal(true);
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
                <div className={styles.itemContent}>
                  <Row gutter={[30, 30]}>
                    {!!collectionList.length && collectionList.map((item: any) => {
                      return (
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <ItemCard
                            item={item}
                            roleMap={roleMap}
                            key={uuidv4().toString()}
                            onClick={() => {
                              history.push({
                                pathname: `/collection/${item.inner_collection_id}`,
                                search: location.search,
                              });
                            }}
                          />
                        </Col>
                      )
                    })}
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!errorState && !loading && selectPlatformModal && !addCollectionModal && (
        <SelectPlatform
          setSelectPlatform={setSelectPlatform}
          onSubmit={() => {
            setSelectPlatformModal(false);
            setAddCollectionModal(true);
          }}
          onCancel={() => {
            setSelectPlatformModal(false);
          }}
        />
      )}
      {!errorState && !loading && !selectPlatformModal && addCollectionModal && (
        <Create
          selectPlatform={selectPlatform}
          urlSearch={search}
          roleList={roleList}
          setErrorState={setErrorState}
          onSubmit={() => {
            setAddCollectionModal(false);
          }}
          onCancel={() => {
            setAddCollectionModal(false);
          }}
        />
      )}
    </UserLayout>
  )
};

export default Collection;
