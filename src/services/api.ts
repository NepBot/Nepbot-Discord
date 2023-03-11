/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-11 20:36:47
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-12 03:47:50
 * @ Description: i@rua.moe
 */

import { request } from './request';

export const SetInfo = async (
  data: API.SetInfo,
  options?: { [key: string]: any },
) => {
  return request<Resp.SetInfo | Resp.Error>('/api/setInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
    getResponse: true,
  });
};

export const GetOwnerSign = async (
  data: API.GetOwnerSign,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetOwnerSign | Resp.Error>('/api/getOwnerSign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
    getResponse: true,
  });
};

export const GetRole = async (
  guild_id: string,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetRole | Resp.Error>(`/api/getRole/${guild_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
    getResponse: true,
  });
};

export const GetServer = async (
  guild_id: string,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetServer | Resp.Error>(`/api/getServer/${guild_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
    getResponse: true,
  });
};

export const GetTxByGuild = async (
  guild_id: string,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetRole | Resp.Error>(`/api/getTxByGuild/${guild_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
    getResponse: true,
  });
};

export const GetUser = async (
  guild_id: string,
  user_id: string,
  sign: string,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetUser | Resp.Error>(
    `/api/getUser/${guild_id}/${user_id}/${sign}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
      getResponse: true,
    },
  );
};
