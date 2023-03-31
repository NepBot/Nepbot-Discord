/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-21 23:04:45
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-31 18:32:30
 * @ Description: i@rua.moe
 */

import { store } from '@/store/localStore';
import { useEffect, useState } from 'react';

interface DiscordInfo {
  guild_id?: string;
  user_id?: string;
  sign?: string;
  expires?: number;
}

export default () => {
  const [discordInfo, setDiscordInfo] = useState<DiscordInfo>({});
  const [discordOperationSign, setDiscordOperationSign] = useState<string>();

  useEffect(() => {
    const _info = store.Get({
      key: 'nepbot:discord:info',
    });
    if (!!_info) {
      setDiscordInfo(_info);
    }

    const _operationSign = store.Get({
      key: 'nepbot:discord:operation:sign',
    });
    if (!!_operationSign) {
      setDiscordOperationSign(_operationSign);
    }
  }, []);

  useEffect(() => {
    store.Set({
      key: 'nepbot:discord:info',
      data: {
        guild_id: discordInfo.guild_id,
        user_id: discordInfo.user_id,
        sign: discordInfo.sign,
      },
      options: {
        expires: discordInfo.expires || 1,
      },
    });
  }, [discordInfo]);

  useEffect(() => {
    store.Set({
      key: 'nepbot:discord:operation:sign',
      data: discordOperationSign,
      options: {
        expires: 1,
      },
    });
  }, [discordOperationSign]);

  return {
    discordInfo,
    discordOperationSign,
    setDiscordInfo,
    setDiscordOperationSign,
  };
};
