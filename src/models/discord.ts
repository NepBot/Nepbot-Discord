/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 22:56:35
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-05 16:37:14
 * @ Description: 
 */

import { GetConnectedAccount, GetServer, GetUser } from '@/services/api';
import { notification } from 'antd';
import { useCallback, useState } from 'react';

interface QueryParams {
  guild_id?: string;
  user_id?: string;
  sign?: string;
}

export default () => {
  const [discordUser, setDiscordUser] = useState<Resp.User>();
  const [discordServer, setDiscordServer] = useState<Resp.Server>();
  const [discordAccountId, setDiscordAccountId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

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
          key: 'error.params',
          message: 'Error',
          description: (res?.data as Resp.Error)?.message || 'Unknown error',
        });
        setLoading(false);
        return undefined;
      }
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
          key: 'error.params',
          message: 'Error',
          description: (res?.data as Resp.Error)?.message || 'Unknown error',
        });
        setLoading(false);
        return undefined;
      }
    },
    [],
  );

  const GetConnected = useCallback(
    async ({ guild_id, user_id }: { guild_id: string; user_id: string }) => {
      setLoading(true);
      const res = await GetConnectedAccount({
        guild_id,
        user_id,
      });

      if (res?.response?.status === 200 && res?.data?.success) {
        setDiscordAccountId((res?.data as Resp.GetConnectedAccount)?.data);
        setLoading(false);
        return (res?.data as Resp.GetConnectedAccount)?.data;
      } else {
        setDiscordAccountId(undefined);
        notification.error({
          key: 'error.params',
          message: 'Error',
          description: (res?.data as Resp.Error)?.message || 'Unknown error',
        });
        setLoading(false);
        return undefined;
      }
    },
    [],
  );

  return {
    loading,
    discordUser,
    discordServer,
    discordAccountId,
    GetUserInfo,
    GetServerInfo,
    GetConnected,
  };
};
