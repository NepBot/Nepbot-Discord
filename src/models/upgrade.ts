/**
 * @ Author: Hikaru
 * @ Create Time: 2023-04-06 03:52:47
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-06 04:01:09
 * @ Description: i@rua.moe
 */

import { store } from '@/store/localStore';
import { useEffect } from 'react';
import { useModel } from 'umi';

export default () => {
  const { setDiscordInfo, setDiscordOperationSign } = useModel('store');

  useEffect(() => {
    const _info = store.Get({
      key: '__storage__info__',
    });

    if (!!_info) {
      store.Set({
        key: 'nepbot:discord:info',
        data: {
          guild_id: _info?.guild_id,
          user_id: _info?.user_id,
          sign: _info?.sign,
        },
        options: {
          expires: _info?.expires || 1,
        },
      });
      store.Remove({
        key: '__storage__info__',
      });
      setDiscordInfo(_info);
    }

    const _operationSign = store.Get({
      key: '__storage__operationSign__',
    });

    if (!!_operationSign) {
      store.Set({
        key: 'nepbot:discord:operation:sign',
        data: _operationSign,
        options: {
          expires: 1,
        },
      });
      store.Remove({
        key: '__storage__operationSign__',
      });
      setDiscordOperationSign(_operationSign);
    }
  }, []);
};
