/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 03:47:44
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-22 22:18:33
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from "react";
import styles from "./style.less";
import { useIntl, useLocation, useModel } from "umi";
import { AiOutlinePlus } from "react-icons/ai";
import { Col, Row, notification } from "antd";
import querystring from 'query-string';
import ItemCard from "../components/ItemCard";
import { API_CONFIG } from "@/constants/config";
import { GetCollection, GetMintbaseCollection, GetOperationSign, GetRole } from "@/services/api";
import SelectPlatform from "@/components/SelectPlatform";
import CreateCollection from "../Create";

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

const Collection: React.FC = () => {
  const { walletSelector, nearAccount, OpenModalWallet } = useModel('near.account');
  const { discordInfo, discordOperationSign, setDiscordInfo, setDiscordOperationSign } = useModel('store');
  const { GetServerInfo } = useModel('discord');
  const [selectPlatformModal, setSelectPlatformModal] = useState<boolean>(false);
  const [addCollectionModal, setAddCollectionModal] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [roleMap, setRoleMap] = useState<Map<string, string>>(new Map());
  const [roleList, setRoleList] = useState<Item.Role[]>();
  const [collectionList, setCollectionList] = useState<Contract.WrappedCollections[]>([]);
  const [selectPlatform, setSelectPlatform] = useState<string>();

  const intl = useIntl();

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!walletSelector?.isSignedIn()) {
        await OpenModalWallet();
      }
    })()
  }, [walletSelector]);

  useEffect(() => {
    (async () => {
      if (!!walletSelector?.isSignedIn() && !!nearAccount && !!search?.guild_id && !!search?.user_id && !!search?.sign) {
        setDiscordInfo({
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign
        });

        const args = {
          account_id: nearAccount?.accountId,
          user_id: search.user_id,
          guild_id: search.guild_id,
          sign: search.sign,
          operationSign: discordOperationSign
        }
        const signature = await nearAccount?.connection.signer.signMessage(Buffer.from(JSON.stringify(args)), nearAccount?.accountId, API_CONFIG().networkId);

        const res = await GetOperationSign({
          account_id: nearAccount?.accountId,
          sign: new TextDecoder().decode(signature?.signature),
          args: args,
        });

        if (res?.response?.status !== 200 || !(res?.data as Resp.GetOperationSign)?.data) {
          setErrorState(true);
          return;
        }
        setDiscordOperationSign((res?.data as Resp.GetOperationSign)?.data);
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
      }
    })()
  }, [walletSelector, nearAccount, search]);

  const handleData = async () => {
    if (!!discordInfo?.guild_id) {
      setLoading(true);
      try {
        const roles = await GetRole({
          guild_id: discordInfo?.guild_id,
        });
        if (roles?.response?.status !== 200 || !(roles?.data as Resp.GetRole)?.data) {
          setErrorState(true);
          return;
        }

        (roles?.data as Resp.GetRole)?.data?.forEach((item: any) => {
          if (item.name !== '@everyone') {
            setRoleMap((roleMap) => roleMap.set(item.id, item.name));
          }
        });
        setRoleList((roles?.data as Resp.GetRole)?.data?.filter((item) => item.name !== '@everyone'));
        const collections = await nearAccount?.viewFunction(API_CONFIG().NFT_CONTRACT, 'get_collections_by_guild', {
          guild_id: discordInfo?.guild_id,
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
              if (!!collectionData?.data && !!(collectionData?.data as Resp.GetCollection)?.results?.length) {
                wrappedCollections.push({
                  royaltyTotal: royaltyTotal / 100,
                  inner_collection_id: collection.collection_id,
                  outer_collection_id: collection.outer_collection_id,
                  ...collection,
                  ...(collectionData?.data as Resp.GetCollection)?.results[0],
                });
              }
              break;
            case 'mintbase':
              collectionData = await GetMintbaseCollection({
                collection_id: collection?.outer_collection_id,
              });
              if (!!collectionData) {
                wrappedCollections.push({
                  royaltyTotal: royaltyTotal / 100,
                  inner_collection_id: collection.collection_id,
                  outer_collection_id: collection.outer_collection_id,
                  ...collection,
                  ...collectionData
                })
              }
              break;
          }
        }

        setCollectionList(wrappedCollections);

        const result: Contract.WrappedCollections[] = [];
        for (let collection of wrappedCollections) {
          const collection_id = collection['inner_collection_id'];
          const collectionInfo = await nearAccount?.viewFunction(API_CONFIG().NFT_CONTRACT, 'get_collection', {
            collection_id,
          });
          result.push({
            creator: collectionInfo?.creator_id,
            minted_count: collectionInfo?.minted_count,
            total_copies: collectionInfo?.total_copies,
            updated: true,
          });
        }
        setCollectionList(result);
      } catch (error) {
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
    }
  };

  return (
    <>
      {!selectPlatformModal && !addCollectionModal && (
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
      {selectPlatformModal && !addCollectionModal && (
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
      {!selectPlatformModal && addCollectionModal && (
        <CreateCollection />
      )}
    </>
  )
};

export default Collection;
