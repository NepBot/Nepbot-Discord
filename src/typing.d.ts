/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-16 17:20:36
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-28 18:28:56
 * @ Description: i@rua.moe
 */

declare namespace Contract {
  interface Collections {
    royalty?: Map<string, any>;
    contract_type?: string;
    outer_collection_id?: string;
    collection_id?: string;
  }

  interface WrappedCollections {
    name?: string;
    royaltyTotal?: number;
    inner_collection_id?: string;
    outer_collection_id?: string;
    mint_count_limit?: number;
    creator?: string;
    minted_count?: number;
    total_copies?: number;
    updated?: boolean;
    contract_type?: string;
    contract?: string;
    cover?: string;
    background?: string;
    media?: string;
    logo?: string;
    collection?: string;
    description?: string;
    mintable_roles?: string[];
    price?: string;
  }

  interface CollectionInfo {
    collection_id?: string;
    creator?: string;
    minted_count?: number;
    total_copies?: number;
    name?: string;
    description?: string;
    cover?: string;
    logo?: string;
    contract?: string;
    serverName?: string;
    serverIcon?: string;
    contract_type?: string;
  }

  interface RuleItem {
    icon?: string;
    name?: string;
    decimals?: number;
    token_symbol?: string;
    guild_id?: string;
    guild_name?: string;
    role_id?: string;
    role_name?: string;
    transaction_hash?: string;
    key_field?: string[];
    fields?: {
      token_amount?: string;
      oct_role?: string;
      balance?: string;
      astrodao_role?: string;
      loyalty_level?: string;
      paras_staking_amount?: string;
      paras_staking_duration?: string;
    };
    key?: number;
  }
}
