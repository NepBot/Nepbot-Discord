/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-16 17:20:36
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-16 21:28:06
 * @ Description: i@rua.moe
 */

declare namespace Nepbot {
  interface txs {
    receiverId?: string;
    actions?: {
      type?: string;
      params?: any;
      methodName?: string;
      args?: {
        [key: string]: any;
      };
      gas?: string;
      deposit?: string;
      kind?: string;
    }[];
  }
}
