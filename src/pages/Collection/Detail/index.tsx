/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-09 19:42:06
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-07 04:23:28
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel, useLocation } from '@umijs/max';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { Col, Input, Row, notification } from 'antd';
import querystring from 'query-string';
import { SiDiscord } from 'react-icons/si';
import ItemCard from './components/ItemCard';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import UserLayout from '@/layouts/UserLayout';
import { API_CONFIG } from '@/constants/config';
import { GetCollection, GetMintbaseCollection } from '@/services/api';
import Add from './Add';
import Loading from '@/components/Loading';
import LinkExpired from '@/components/LinkExpired';
import NoData from '@/components/NoData';

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

const CollectionDetail: React.FC = () => {
  const { nearAccount } = useModel('near.account');
  const { GetServerInfo } = useModel('discord');
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showList, setShowList] = useState<Contract.CollectionInfo[]>([]);
  const [seriesList, setSeriesList] = useState([]);
  const [addModal, setAddModal] = useState<boolean>(false);

  const intl = useIntl();

  const params = useParams<{
    id: string
  }>();

  const [collectionInfo, setCollectionInfo] = useState<Contract.CollectionInfo>({
    collection_id: params.id,
    creator: '',
    minted_count: 0,
    total_copies: 0,
    name: params.id?.split(":")[1]?.split("-guild-")[0]?.replaceAll("-", " "),
  })

  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!search.guild_id) {
        setErrorState(true);
        setLoading(false);
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: 'Missing parameters',
        });
        return;
      }

      if (!nearAccount) {
        return;
      }

      try {
        setLoading(true);
        const collection = await nearAccount?.viewFunction(API_CONFIG().NFT_CONTRACT, "get_collection", { collection_id: params.id });

        const server = await GetServerInfo({
          guild_id: search?.guild_id,
        });
        var info: any = {
          collection_id: params?.id,
          creator: collection?.creator_id,
          minted_count: collection?.minted_count,
          total_copies: collection?.total_copies,
          serverName: server?.name,
          serverIcon: server?.iconURL,
          contract_type: collection?.contract_type,
        }

        switch (collection.contract_type) {
          case 'paras':
            const parasRes = await GetCollection({
              collection_id: collection?.outer_collection_id,
            })

            if (!parasRes?.data) {
              notification.error({
                key: 'error.getData',
                message: 'Error',
                description: 'Failed to get collection info'
              });
            }
            const parasData = (parasRes?.data as Resp.GetCollection)?.data;

            info.name = params.id?.split(":")[1]?.split("-guild-")[0]?.replaceAll("-", " ");
            info.cover = API_CONFIG().IPFS + parasData?.results![0]['cover']!;
            info.logo = API_CONFIG().IPFS + parasData?.results![0]['media']!;
            info.contract = API_CONFIG().PARAS_CONTRACT;
            info.description = parasData?.results![0]['description']!;
            break;
          case 'mintbase':
            info.contract = API_CONFIG().MINTBASE_CONTRACT;
            const mintbaseRes = await GetMintbaseCollection({
              collection_id: collection?.outer_collection_id,
            });

            if (!mintbaseRes?.data) {
              notification.error({
                key: 'error.getData',
                message: 'Error',
                description: 'Failed to get collection info',
              });
            }

            const mintbaseData = (mintbaseRes?.data as Resp.GetMintbaseCollection).metadata;

            if (!!mintbaseData) {
              info.name = mintbaseData?.name;
              info.description = mintbaseData?.description;
              info.cover = mintbaseData?.background;
              info.logo = mintbaseData?.logo;
            }
            break;
        }
        setCollectionInfo(info);

        const res = await nearAccount.viewFunction(API_CONFIG().NFT_CONTRACT, 'get_token_metadata', { collection_id: params.id });
        setSeriesList(res);
        setShowList(res);
        setLoading(false);
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, [addModal, nearAccount]);

  return (
    <UserLayout>
      {!errorState && loading && (
        <Loading />
      )}
      {errorState && !loading && (
        <LinkExpired />
      )}
      {!errorState && !loading && (
        <>
          {!addModal && (
            <div className={styles.collectionDetailContainer}>
              <div className={styles.cover}>
                <img
                  src={!!collectionInfo?.cover ? collectionInfo?.cover : require('@/assets/collection/banner.webp')}
                  alt='cover'
                  className={styles.coverImage}
                />
              </div>
              <div className={styles.headerContainer}>
                <div className={styles.headerWrapper}>
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
                      onChange={e => {
                        if (e.target.value === '') {
                          setShowList(seriesList);
                          return;
                        }
                        setShowList(seriesList?.filter((item: any) => item?.name?.toLowerCase()?.includes(e.target.value?.toLowerCase())));
                      }}
                    />
                  </div>
                  <div className={styles.buttonsContainer}>
                    <div
                      className={styles.button}
                      onClick={() => {
                        setAddModal(true);
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
              </div>
              <div className={styles.wrapper}>
                <div className={styles.contentContainer}>
                  <div className={styles.iconContainer}>
                    <img
                      src={!!collectionInfo?.logo ? collectionInfo?.logo : require('@/assets/collection/icon.webp')}
                      alt='icon'
                      className={styles.iconImage}
                    />
                  </div>
                  <div className={styles.contentHeaderContainer}>
                    <div className={styles.metaContainer}>
                      <div className={styles.metaTitle}>
                        {collectionInfo?.name}
                      </div>
                      <div className={styles.metaCreator}>
                        {intl.formatMessage({
                          id: 'collection.detail.creator'
                        }, {
                          name: (
                            <b
                              onClick={() => {
                                window.open(`${API_CONFIG()?.NEARBLOCKS}${collectionInfo?.creator}`, '_blank');
                              }}
                            >
                              {collectionInfo?.creator}
                            </b>
                          )
                        })}
                      </div>
                      <div className={styles.metaCreator}>
                        {intl.formatMessage({
                          id: 'collection.detail.contract'
                        }, {
                          name: (
                            <b
                              onClick={() => {
                                window.open(`${API_CONFIG()?.NEARBLOCKS}${collectionInfo?.contract}`, '_blank');
                              }}
                            >
                              {collectionInfo?.contract}
                            </b>
                          )
                        })}
                      </div>
                    </div>
                    <div className={styles.discordContainer}>
                      {!!collectionInfo.serverIcon ? (
                        <img
                          src={collectionInfo?.serverIcon}
                          alt={collectionInfo?.serverName}
                          className={styles.discordIcon}
                        />
                      ) : (
                        <SiDiscord
                          className={styles.discordIcon}
                        />
                      )}
                      {collectionInfo?.serverName}
                    </div>
                  </div>
                  <div className={styles.statisticContainer}>
                    <div className={styles.statisticItem}>
                      <div className={styles.statisticItemValue}>
                        {!!collectionInfo?.total_copies ? collectionInfo?.total_copies : 0}
                      </div>
                      <div className={styles.statisticItemLabel}>
                        {intl.formatMessage({
                          id: 'collection.detail.statistic.totalCopies'
                        })}
                      </div>
                    </div>
                    <div className={styles.statisticItem}>
                      <div className={styles.statisticItemValue}>
                        {!!collectionInfo?.minted_count ? collectionInfo?.minted_count : 0}
                      </div>
                      <div className={styles.statisticItemLabel}>
                        {intl.formatMessage({
                          id: 'collection.detail.statistic.totalMinted'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={styles.descriptionContainer}>
                    {collectionInfo?.description}
                  </div>
                  <div className={styles.itemsContainer}>
                    {!!showList?.length && (
                      <Row gutter={[30, 30]}>
                        {showList.map((item: any) => {
                          return (
                            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                              <ItemCard
                                key={uuidv4()}
                                item={item}
                                onClick={() => {
                                  window.open(`${API_CONFIG().PARAS}/token/${API_CONFIG().PARAS_CONTRACT}::${item?.token_series_id}`, '_blank')
                                }}
                              />
                            </Col>
                          )
                        })}
                      </Row>
                    )}
                    {!showList?.length && (
                      <NoData
                        name='collection'
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {addModal && (
            <Add
              collectionInfo={collectionInfo}
              onCancel={() => {
                setAddModal(false);
              }}
            />
          )}
        </>
      )}
    </UserLayout>
  );
};

export default CollectionDetail;
