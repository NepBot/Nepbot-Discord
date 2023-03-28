import { useEffect } from 'react';
/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 22:56:35
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-28 16:24:51
 * @ Description: i@rua.moe
 */

import { GetServer, GetUser } from '@/services/api';
import { history } from '@umijs/max';
import { notification } from 'antd';
import querystring from 'query-string';
import { useCallback, useState } from 'react';

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

export default () => {
  const [discordUser, setDiscordUser] = useState<Resp.User>();
  const [discordServer, setDiscordServer] = useState<Resp.Server>();
  const [loading, setLoading] = useState<boolean>(true);

  const search: QueryParams = querystring.parse(history?.location?.search);

  const GetUserInfo = useCallback(
    async ({
      guild_id,
      user_id,
      sign,
    }: {
      guild_id: string;
      user_id: string;
      sign: string;
    }) => {
      setLoading(true);
      const res = await GetUser({
        guild_id,
        user_id,
        sign,
      });

      if (res?.response?.status === 200 && res?.data?.success) {
        setDiscordUser((res?.data as Resp.GetUser)?.data);
        setLoading(false);
        return (res?.data as Resp.GetUser)?.data;
      } else {
        setDiscordUser(undefined);
        notification.error({
          message: 'Error',
          description: (res?.data as Resp.Error)?.message || 'Unknown error',
        });
      }
      setLoading(false);
    },
    [],
  );

  const GetServerInfo = useCallback(
    async ({ guild_id }: { guild_id: string }) => {
      setLoading(true);
      const res = await GetServer({
        guild_id,
      });

      if (res?.response?.status === 200 && res?.data?.success) {
        setDiscordServer((res?.data as Resp.GetServer)?.data);
        setLoading(false);
        return (res?.data as Resp.GetServer)?.data;
      } else {
        setDiscordUser(undefined);
        notification.error({
          message: 'Error',
          description: (res?.data as Resp.Error)?.message || 'Unknown error',
        });
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    if (!!search.guild_id && !!search.user_id && !!search.sign) {
      GetUserInfo({
        guild_id: search.guild_id,
        user_id: search.user_id,
        sign: search.sign,
      });
    }

    if (!!search.guild_id) {
      GetServerInfo({
        guild_id: search.guild_id,
      });
    }
  }, [location.search]);

  return {
    loading,
    discordUser,
    discordServer,
    GetUserInfo,
    GetServerInfo,
  };
};
