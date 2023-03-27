/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-11 20:36:18
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-27 17:58:45
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

  interface SendMsgSnapshot {
    guild_id?: string;
    channel_id?: string;
    hash?: string;
  }

  interface SendFfMsg {
    guild_id?: string;
    channel_id?: string;
    role_id?: string;
    token_contract?: string;
    total_amount?: string;
    amount_per_share?: string;
    end_time?: string;
    hash?: string;
  }

  interface GetAirdropFTSign {
    args?: {
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

  interface Server {
    id?: string;
    name?: string;
    icon?: string;
    features?: string[];
    commands?: string[];
    members?: string[];
    channels?: string[];
    bans?: string[];
    roles?: string[];
    stageInstances?: string[];
    invites?: string[];
    scheduledEvents?: string[];
    splash?: string;
    banner?: string;
    description?: string;
    verificationLevel?: string;
    vanityURLCode?: string;
    nsfwLevel?: string;
    discoverySplash?: string;
    memberCount?: number;
    large?: boolean;
    premiumProgressBarEnabled?: boolean;
    applicationId?: string;
    afkTimeout?: number;
    afkChannelId?: string;
    systemChannelId?: string;
    premiumTier?: string;
    premiumSubscriptionCount?: number;
    explicitContentFilter?: string;
    mfaLevel?: string;
    joinedTimestamp?: number;
    defaultMessageNotifications?: string;
    systemChannelFlags?: number;
    maximumMembers?: number;
    maximumPresences?: number;
    approximateMemberCount?: string;
    approximatePresenceCount?: string;
    vanityURLUses?: string;
    rulesChannelId?: string;
    publicUpdatesChannelId?: string;
    preferredLocale?: string;
    ownerId?: string;
    emojis?: string[];
    stickers?: string[];
    shardId?: number;
    widgetEnabled?: boolean;
    widgetChannelId?: string;
    createdTimestamp?: number;
    nameAcronym?: string;
    iconURL?: string;
    splashURL?: string;
    discoverySplashURL?: string;
    bannerURL?: string;
  }

  interface GetServer extends Body {
    code?: number;
    success?: boolean;
    data?: Server;
  }

  interface GetTxByGuild extends Body {
    success?: boolean;
    data?: {
      transaction_hash?: string;
    }[];
  }

  interface User {
    userId?: string;
    nickname?: string;
    avatar?: string;
    avatarURL?: string;
    displayAvatarURL?: string;
    displayName?: string;
    roles?: string[];
    joinedTimestamp?: string;
    premiumSinceTimestamp?: string;
    deaf?: boolean;
    mute?: boolean;
    flags?: number;
    pending?: boolean;
    permissions?: string;
    communicationDisabledUntilTimestamp?: string;
  }

  interface GetUser extends Body {
    code?: number;
    success?: boolean;
    data?: User;
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

  interface CreateSeries extends Body {
    code?: number;
    data?: any;
    success?: boolean;
  }

  interface GetCollection extends Body {
    code?: number;
    data?: {
      results?: {
        cover?: string;
        media?: string;
        description?: string;
      }[];
    };
    success?: boolean;
  }

  interface GetMintbaseCollection extends Body {
    code?: number;
    metadata?: {
      name?: string;
      description?: string;
      background?: string;
      logo?: string;
    };
    success?: boolean;
  }

  interface GetOperationSign extends Body {
    code?: number;
    data?: string;
    success?: boolean;
  }

  interface GetMintSign extends Body {
    code?: number;
    data?: string;
    success?: boolean;
  }

  interface GetSnapshotSign extends Body {
    success?: boolean;
    data?: any;
  }

  interface TwitterVerify extends Body {
    name?: string;
    value?: string;
  }

  interface SendFfMsg extends Body {
    code?: number;
    success?: boolean;
    data?: any;
  }

  interface SendMsgSnapshot extends Body {
    code?: number;
    data?: any;
    success?: boolean;
  }

  interface GetAirdropFTSign extends Body {
    code?: number;
    data?: any;
    success?: boolean;
  }

  interface GetAirdropNFTSign extends Body {
    code?: number;
    data?: any;
    success?: boolean;
  }
}
