/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-08 02:53:34
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 23:03:32
 * @ Description: i@rua.moe
 */

import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { useIntl, useModel, useLocation } from '@umijs/max';
import querystring from 'query-string';
import Background from '@/components/TopBackground';
import classNames from 'classnames';
import { Spin, notification } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import LinkExpired from '@/components/LinkExpired';
import Loading from '@/components/Loading';
import { AiFillCheckCircle } from 'react-icons/ai';

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

const Verify: React.FC = () => {
  const { nearWallet, nearAccount, OpenModalWallet } = useModel('near.account');
  const { discordUser, discordServer, GetUserInfo, GetServerInfo } = useModel('discord');
  const [errorState, setErrorState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const intl = useIntl();
  const location = useLocation();
  const search: QueryParams = querystring.parse(location.search);

  useEffect(() => {
    (async () => {
      if (!!search?.guild_id && !!search?.user_id && !!search?.sign) {
        const userinfo = await GetUserInfo({
          guild_id: search.guild_id,
          user_id: search.user_id,
          sign: search.sign
        });

        const serverinfo = await GetServerInfo({
          guild_id: search.guild_id,
        });

        if (!userinfo || !serverinfo) {
          notification.error({
            key: 'error.params',
            message: 'Error',
            description: 'Missing parameters',
          });
          setErrorState(true);
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
    })();
  }, []);

  return (
    <>
      {!errorState && loading && (
        <Loading />
      )}
      {errorState && !loading && (
        <LinkExpired />
      )}
      {!errorState && !loading && (
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
                {!nearWallet || !nearAccount && (
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
                        if (!!discordUser && !!discordServer && !loading) {
                          await nearWallet.signOut();
                          window.location.reload();
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
