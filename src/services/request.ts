/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-11 03:05:42
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-13 03:59:27
 * @ Description: 
 */

import { extend } from 'umi-request';

const errorHandler = (error: any) => {
  const { response = {}, data = {} } = error;
  return {
    response,
    data,
  } as Resp.Body;
};

export const request = extend({
  errorHandler,
  // credentials: "same-origin",
  // mode: "no-cors"
});
