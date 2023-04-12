/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 02:53:34
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-04 04:10:26
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { history, useIntl, useModel, useLocation } from '@umijs/max';
import querystring from 'query-string';
import Background from '@/components/TopBackground';
import classNames from 'classnames';
import { Spin, notification } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import LinkExpired from '@/components/LinkExpired';
import Loading from '@/components/Loading';
import { AiFillCheckCircle } from 'react-icons/ai';
import { DisconnectAccount, SetInfo } from '@/services/api';
import { SignMessage } from '@/utils/near';
import Fail from '@/components/Fail';

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

const Verify: React.FC = () => {
  const { nearWallet, nearAccount, OpenModalWallet, GetKeyStore } = useModel('near.account');
  const { discordUser, discordServer, GetUserInfo, GetServerInfo, GetConnected } = useModel('discord');
  const { discordInfo, setDiscordInfo } = useModel('store');
  const [expiredState, setExpiredState] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const intl = useIntl();
  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!!search?.guild_id && !!search?.user_id && !!search?.sign) {
        setDiscordInfo({
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign
        });

        const userinfo = await GetUserInfo({
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign
        });

        if (!userinfo) {
          notification.error({
            key: 'error.params',
            message: 'Error',
            description: 'Link expired, please apply a new link',
          });
          setExpiredState(true);
          setLoading(false);
          return;
        }

        await GetConnected({
          guild_id: search.guild_id,
          user_id: search.user_id,
        });

        await GetServerInfo({
          guild_id: search.guild_id,
        });

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
    })();
  }, []);

  useEffect(() => {
    if (!!discordInfo && !!nearAccount) {
      (async () => {
        const keystore = await GetKeyStore(nearAccount?.accountId);

        if (!keystore) {
          return;
        }

        const args = {
          account_id: nearAccount?.accountId,
          user_id: discordInfo.user_id,
          guild_id: discordInfo.guild_id,
          sign: discordInfo.sign,
        }

        const signature = await SignMessage({
          keystore: keystore,
          object: args,
        });

        const result = await SetInfo({
          args: args,
          account_id: nearAccount?.accountId,
          sign: signature.signature,
        });

        if (!result?.data?.success) {
          notification.error({
            key: 'error.connect',
            message: 'Error',
            description: 'Failed to connect',
          });
          setExpiredState(true);
          setLoading(false);
          return;
        }
      })();
    }
  }, [discordInfo, nearAccount]);

  const handleDisconnect = async () => {
    if (!!nearWallet && !!nearWallet && !loading) {
      if (!!search.guild_id && !!search.user_id && !!search.sign) {
        const args = {
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign
        }
        const keystore = await GetKeyStore(nearAccount?.accountId);
        // await nearWallet.signOut();

        const signature = await SignMessage({
          keystore: keystore!,
          object: args,
        });
        let res = await DisconnectAccount({
          args: args,
          account_id: nearAccount?.accountId,
          sign: signature.signature,
        });
        console.log(res)
        
        notification.success({
          key: 'success.disconnect',
          message: intl.formatMessage({
            id: 'connect.disconnect.title',
          }),
          description: intl.formatMessage({
            id: 'connect.disconnect.desc',
          }),
        });
        window.location.href = (res.data as Resp.DisconnectAccount).data
      }
    }
  }

  return (
    <>
      {!errorState && !expiredState && loading && (
        <Loading />
      )}
      {!errorState && expiredState && !loading && (
        <LinkExpired />
      )}
      {errorState && expiredState && !loading && (
        <Fail />
      )}
      {!errorState && !expiredState && !loading && (
        <div className={styles.connectContainer}>
          <Background />
          <div className={styles.wrapper}>
            <div className={styles.windowContainer}>
              <div className={styles.userContainer}>
                <div className={styles.avatar}>
                  <img
                    src={discordUser?.displayAvatarURL}
                    alt={discordUser?.displayName}
                    className={styles.avatarImg}
                  />
                  {!!nearWallet && !!nearAccount && (
                    <AiFillCheckCircle className={styles.linked} />
                  )}
                </div>
                <div className={styles.nickname}>
                  {discordUser?.displayName}
                </div>
                <div className={styles.accountId}>
                  {nearAccount?.accountId}
                </div>
                <div className={styles.serverName}>
                  {discordServer?.name}
                </div>
              </div>
              <div className={styles.buttonContainer}>
                {(!nearWallet || !nearAccount) && (
                  <>
                    <div
                      className={classNames(styles.button, (!discordUser || !discordServer) && styles.buttonDisable)}
                      onClick={async () => {
                        if (!!discordUser && !!discordServer && !loading) {
                          await OpenModalWallet();
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
                          id: 'connect.button.connect'
                        })
                      )}
                    </div>
                    <div className={styles.desc}>
                      {intl.formatMessage({
                        id: 'connect.button.desc'
                      })}
                    </div>
                  </>
                )}
                {!!nearWallet && !!nearAccount && (
                  <>
                    {notification.success({
                      key: 'success.connect',
                      message: intl.formatMessage({
                        id: 'connect.success.title',
                      }),
                      description: intl.formatMessage({
                        id: 'connect.success.desc',
                      }),
                    })}
                    <div
                      className={classNames(styles.button, (!discordUser || !discordServer) && styles.buttonDisable)}
                      onClick={async () => {
                        await handleDisconnect()
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
                          id: 'connect.button.disconnect'
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
};

export default Verify;
