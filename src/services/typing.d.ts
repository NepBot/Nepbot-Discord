/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-11 20:36:18
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-14 23:01:27
 * @ Description: i@rua.moe
 */

declare namespace Item {
  interface Tag {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: null;
    subscription_listing_id?: string;
    available_for_purchase?: boolean;
    guild_connections?: boolean;
  }

  interface Role {
    id?: string;
    name?: string;
    color?: number;
    hoist?: boolean;
    icon?: string;
    unicode_emoji?: string;
    position?: number;
    permissions?: string;
    managed?: boolean;
    mentionable?: boolean;
    tags?: Tag[];
  }

  interface Emoji {
    id?: string;
    name?: string;
    roles?: string[];
    user?: User;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
  }

  interface User {
    id?: string;
    username?: string;
    discriminator?: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
  }
}

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

  interface DisconnectAccount {
    args?: {
      user_id?: string;
      guild_id?: string;
      sign?: string;
    };
    account_id?: string;
    sign?: string;
  }

  interface CreateParasCollection {
    logo?: File | Blob;
    cover?: File | Blob;
    args?: {
      args?: {
        args?: {
          collection?: string;
          description?: string;
          creator_id?: string;
          twitter?: string;
          website?: string;
          discord?: string;
        };
        sign?: string;
        user_id?: string;
        guild_id?: string;
      };
      account_id?: string;
      sign?: string;
    };
  }

  interface CreateSeries {
    image?: File | Blob;
    params?: {
      collection?: string;
      description?: string;
      creator_id?: string;
      collection_id?: string;
      attributes?: {
        trait_type?: string;
        value?: string;
      }[];
      mime_type?: string;
      blurhash?: string;
    };
  }

  interface GetOperationSign {
    args: {
      user_id?: string;
      guild_id?: string;
      sign?: string;
    };
    account_id?: string;
    sign?: string;
  }

  interface GetMintSign {
    args: {
      user_id?: string;
      guild_id?: string;
      sign?: string;
      collection_id?: string;
    };
    account_id?: string;
    sign?: string;
  }

  interface TwitterVerify {
    state?: string;
    code?: string;
  }

  interface GetSnapshotSign {
    args: {
      user_id?: string;
      guild_id?: string;
      sign?: string;
      contract_address?: string;
    };
    account_id?: string;
    sign?: string;
  }

  interface SendFfMsg {
    guild_id?: string;
    channel_id?: string;
    role_id?: string;
    token_id?: string;
    total_amount?: string;
    amount_per_share?: string;
    end_time?: string;
    hash?: string;
  }

  interface GetAirdropFTSign {
    args: {
      user_id?: string;
      guild_id?: string;
      sign?: string;
      contract_address?: string;
      role_id?: string;
      token_id?: string;
      end_time?: string;
    };
    account_id?: string;
    sign?: string;
  }

  interface GetAirdropNFTSign {
    args: {
      user_id?: string;
      guild_id?: string;
      sign?: string;
      role_id?: string;
      token_contract?: string;
      total_amount?: string;
      amount_per_share?: string;
      end_time?: string;
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

  interface SetInfo extends Body {
    seccess?: boolean;
  }

  interface GetOwnerSign extends Body {
    success?: boolean;
    data?: {
      timestamp?: number;
      sign?: string;
    };
  }

  interface GetRole extends Body {
    success?: boolean;
    data?: Item.Role[];
  }

  interface GetServer extends Body {
    success?: boolean;
    data?: {
      id?: string;
      name?: string;
      icon?: string;
      description?: string;
      splash?: string;
      discovery_splash?: string;
      approximate_member_count?: number;
      approximate_presence_count?: number;
      features?: string[];
      emojis?: Item.Emoji[];
      banner?: string;
      owner_id?: string;
      application_id?: string;
      region?: string;
      afk_channel_id?: string;
      afk_timeout?: number;
      system_channel_id?: string;
      widget_enabled?: boolean;
      widget_channel_id?: string;
      verification_level?: number;
      roles?: Item.Role[];
      default_message_notifications?: number;
      mfa_level?: number;
      explicit_content_filter?: number;
      max_presences?: number;
      max_members?: number;
      max_video_channel_users?: number;
      vanity_url_code?: string;
      premium_tier?: number;
      premium_subscription_count?: number;
      system_channel_flags?: number;
      preferred_locale?: string;
      rules_channel_id?: string;
      public_updates_channel_id?: string;
    };
  }

  interface GetTxByGuild extends Body {
    success?: boolean;
    data?: {
      transaction_hash?: string;
    }[];
  }

  interface GetUser extends Body {
    success?: boolean;
    data?: {
      user?: Item.User;
      nick?: string;
      avatar?: string;
      roles?: string[];
      joined_at?: string;
      premium_since?: string;
      deaf?: boolean;
      mute?: boolean;
      flags?: number;
      pending?: boolean;
      permissions?: string;
      communication_disabled_until?: string;
    };
  }

  interface GetConnectedAccount extends Body {
    success?: boolean;
    data?: string;
  }

  interface DisconnectAccount extends Body {
    success?: boolean;
  }

  interface CreateParasCollection extends Body {
    status?: number;
    data?: {
      collection?: {
        _id?: string;
        collection_id?: string;
        creator_id?: string;
        collection?: string;
        cover?: string;
        description?: string;
        blurhash?: string;
        media?: string;
        socialMedia?: {
          twitter?: string;
          discord?: string;
          website?: string;
        };
        createdAt?: string;
        updatedAt?: string;
      };
    };
  }

  interface CreateSeries extends Body {}

  interface GetCollection extends Body {}

  interface GetOperationSign extends Body {
    success?: boolean;
    data?: string;
  }

  interface GetMintSign extends Body {
    success?: boolean;
    data?: any;
  }

  interface GetSnapshotSign extends Body {
    success?: boolean;
    data?: any;
  }

  interface TwitterVerify extends Body {
    success?: boolean;
    data?: any;
  }

  interface SendFfMsg extends Body {
    success?: boolean;
    data?: any;
  }

  interface GetAirdropFTSign extends Body {
    success?: boolean;
    data?: any;
  }

  interface GetAirdropNFTSign extends Body {
    success?: boolean;
    data?: any;
  }
}
