/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-11 20:36:18
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-12 03:47:38
 * @ Description: i@rua.moe
 */

declare namespace API {
  interface SetInfo {
    args?: {
      account_id?: string;
      user_id?: string;
      guild_id?: string;
      sign?: string;
    };
    account_id?: string;
    sign?: string;
  }

  interface GetOwnerSign {
    args?: {
      sign?: string;
      user_id?: string;
      guild_id?: string;
    };
    account_id?: string;
    sign?: string;
  }
}

declare namespace Resp {
  interface Error {
    code?: number;
    message?: string;
    success?: boolean;
  }

  interface Body {
    data?: any;
    response?: any;
  }

  interface SetInfo extends Body {}

  interface GetOwnerSign extends Body {
    data?: {
      timestamp?: number;
      sign?: string;
    };
  }

  // TODO: GetRole Type
  interface GetRole extends Body {
    data?: {
      name?: string;
      id?: string;
    }[];
  }

  // TODO: GetServer Type
  interface GetServer extends Body {
    data?: {
      name?: string;
    };
  }

  // TODO: GetTxByGuild Type
  interface GetTxByGuild extends Body {
    data?: any;
  }

  // TODO: GetUser Type
  interface GetUser extends Body {
    data?: {
      displayName?: string;
      displayAvatarURL?: string;
    };
  }
}
