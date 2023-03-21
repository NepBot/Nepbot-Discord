/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-16 17:20:36
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-22 04:04:37
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
    royaltyTotal?: number;
    inner_collection_id?: string;
    outer_collection_id?: string;
    creator?: string;
    minted_count?: number;
    total_copies?: number;
    updated?: boolean;
  }
}
