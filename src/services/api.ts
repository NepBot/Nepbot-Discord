import { API_CONFIG } from '@/constants/config';
/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-11 20:36:47
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 04:23:46
 * @ Description: i@rua.moe
 */

import { _DEBUG, _DEBUG_API } from '@/constants/env';
import { GenerateToken } from '@/utils/paras';
import { request } from './request';

export const SetInfo = async (
  data: API.SetInfo,
  options?: { [key: string]: any },
) => {
  return request<Resp.SetInfo | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/setInfo`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const GetOwnerSign = async (
  data: API.GetOwnerSign,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetOwnerSign | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getOwnerSign`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const GetRole = async (
  path: {
    guild_id: string;
  },
  options?: { [key: string]: any },
) => {
  return request<Resp.GetRole | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getRole/${path.guild_id}`,
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

export const GetServer = async (
  path: {
    guild_id: string;
  },
  options?: { [key: string]: any },
) => {
  return request<Resp.GetServer | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getServer/${path.guild_id}`,
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

export const GetTxByGuild = async (
  path: {
    guild_id: string;
  },
  options?: { [key: string]: any },
) => {
  return request<Resp.GetTxByGuild | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getTxByGuild/${path.guild_id}`,
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

export const GetUser = async (
  path: {
    guild_id: string;
    user_id: string;
    sign: string;
  },
  options?: { [key: string]: any },
) => {
  return request<Resp.GetUser | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getUser/${path.guild_id}/${
      path.user_id
    }/${path.sign}`,
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

export const GetConnectedAccount = async (
  path: {
    guild_id: string;
    user_id: string;
  },
  options?: { [key: string]: any },
) => {
  return request<Resp.GetConnectedAccount | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getConnectedAccount/${path.guild_id}/${
      path.user_id
    }`,
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

export const DisconnectAccount = async (
  data: API.DisconnectAccount,
  options?: { [key: string]: any },
) => {
  return request<Resp.DisconnectAccount | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/disconnectAccount`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const CreateParasCollection = async (
  data: API.CreateParasCollection,
  options?: { [key: string]: any },
) => {
  const formData = new FormData();
  formData.append('files', data.logo as Blob);
  formData.append('files', data.cover as Blob);
  formData.append('args', JSON.stringify(data.args));

  return request<Resp.CreateParasCollection | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/createParasCollection`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
      requestType: 'form',
    },
  );
};

export const CreateSeries = async (
  data: API.CreateSeries,
  options?: { [key: string]: any },
) => {
  const Authorization = await GenerateToken();

  const formData = new FormData();
  formData.append('files', data.image as Blob);
  formData.append(
    'files',
    new Blob([JSON.stringify(data.params)], { type: 'application/json' }),
  );

  return request<Resp.CreateSeries | Resp.Error>(
    `${API_CONFIG().PARAS_API}/uploads`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Authorization,
      },
      data,
      ...(options || {}),
      getResponse: true,
      requestType: 'form',
    },
  );
};

export const GetCollection = async (
  params: {
    collection_id: string;
  },
  options?: { [key: string]: any },
) => {
  return request<Resp.GetCollection | Resp.Error>(
    `${API_CONFIG().PARAS_API}/collections`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        ...params,
      },
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const GetMintbaseCollection = async (
  params: {
    collection_id: string;
  },
  options?: { [key: string]: any },
) => {
  return request<Resp.GetMintbaseCollection | Resp.Error>(
    `${API_CONFIG().AEWEAVE_API}/${params.collection_id}`,
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

export const GetOperationSign = async (
  data: API.GetOperationSign,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetOperationSign | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getOperationSign`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const GetMintSign = async (
  data: API.GetMintSign,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetMintSign | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getMintSign`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const TwitterVerify = async (
  data: API.TwitterVerify,
  options?: { [key: string]: any },
) => {
  return request<Resp.TwitterVerify[] | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/twitter/callback`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const GetSnapshotSign = async (
  data: API.GetSnapshotSign,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetSnapshotSign | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getSnapshotSign`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const SendMsgSnapshot = async (
  data: API.SendMsgSnapshot,
  options?: { [key: string]: any },
) => {
  return request<Resp.SendMsgSnapshot | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/snapshot/sendmsg`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const SendFfMsg = async (
  data: API.SendFfMsg,
  options?: { [key: string]: any },
) => {
  return request<Resp.SendFfMsg | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/airdrop/sendftmsg`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const GetAirdropFTSign = async (
  data: API.GetAirdropFTSign,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetAirdropFTSign | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getAirdropFTSign`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};

export const GetAirdropNFTSign = async (
  data: API.GetAirdropNFTSign,
  options?: { [key: string]: any },
) => {
  return request<Resp.GetAirdropNFTSign | Resp.Error>(
    `${!_DEBUG ? '/api' : _DEBUG_API}/getAirdropNFTSign`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      ...(options || {}),
      getResponse: true,
    },
  );
};
