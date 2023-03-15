import { GetServer, GetUser } from '@/services/api';
import { notification } from 'antd';
import { useCallback, useState } from 'react';
/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-15 22:56:35
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-15 23:28:41
 * @ Description: i@rua.moe
 */

export default () => {
  const [discordUser, setDiscordUser] = useState<Resp.User>();
  const [discordServer, setDiscordServer] = useState<Resp.Server>();
  const [loading, setLoading] = useState<boolean>(false);

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

      if (res?.response?.status === 200 && res?.data?.code === 200) {
        setDiscordUser((res?.data as Resp.GetUser)?.data);
      } else {
        setDiscordUser(undefined);
        notification.error({
          message: 'Error',
          description: (res?.data as Error)?.message,
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

      if (res?.response?.status === 200 && res?.data?.code === 200) {
        setDiscordServer((res?.data as Resp.GetServer)?.data);
      } else {
        setDiscordUser(undefined);
        notification.error({
          message: 'Error',
          description: (res?.data as Error)?.message,
        });
      }
      setLoading(false);
    },
    [],
  );

  return {
    loading,
    discordUser,
    discordServer,
    GetUserInfo,
    GetServerInfo,
  };
};
