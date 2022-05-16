import {getConfig} from "../config";
import axios from "axios";
import {generateToken} from "../utils/request";
const config = getConfig()

export const setInfo = async (args) => {
    const json = await fetch(`/api/set-info`, {
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    const result = await json.json()
    if (result.success) {
        return result.data || true
    }
    return false
}
export const signRule = async (args)=>{
    const json = await fetch(`/api/getOwnerSign`,{
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    const result = await json.json()
    if (result.success) {
        return result.data || true
    }
    return false
}
export const getRoleList = async (guild_id)=>{
    const json = await fetch(`/api/getRole/${guild_id}`);
    const result = await json.json()
    if (result.success) {
        return result.data || true
    }
    return false
}
export const getServer = async (guild_id)=>{
    const json = await fetch(`/api/getServer/${guild_id}`);
    const result = await json.json()
    if (result.success) {
        return result.data || true
    }
    return false
}
export const getUser = async (guild_id, user_id) => {
    const json = await fetch(`/api/getUser/${guild_id}/${user_id}`);
    const result = await json.json()
    if (result.success) {
        return result.data || true
    }
    return false
}

// export const getCollectionList = async (guild_id)=>{
//     const json = await fetch(`/api/getRole/${guild_id}`);
//     return await json.json();
// }

export const createCollection = async (data)=>{
    const Authorization = await generateToken()
    const result =  await axios.request({
        method:"post",
        url:`https://api-v2-${config.networkId}-master.paras.id/collections`,
        data,
        headers:{Authorization:Authorization}
    })
    // const json = await fetch(`/api/createParasCollection`, {
    //     method:"POST",
    //     body: data
    // })
    // const result = await json.json()
    if (result.data.status == 1) {
        return result.data.data
    }
    return false
}
export const createSeries = async (data)=>{
    const Authorization = await generateToken()
    const result = await axios.request({
        method:"post",
        url:`https://api-v2-${config.networkId}-master.paras.id/uploads`,
        data,
        headers:{Authorization:Authorization}
    })
    if (result.data.status == 1) {
        return result.data.data
    }
    return false
}

export const getCollection = async (collectionId) => {
    const result = await axios.request({
        method:"get",
        url:`https://api-v2-${config.networkId}-master.paras.id/collections?collection_id=${collectionId}`,
    })
    if (result.data.status == 1) {
        return result.data.data
    }
    return false
}

// export const getRuleList = async (params)=>{
//     return await axios.request({
//         method:"get",
//         url:`/role/list/${store.get('guild_id')}`,
//         params,
//     })
// }

// export const addRule = async (data)=>{
//     return await axios.request({
//         method:"post",
//         url:"/role/add",
//         data,
//     })
// }

// export const delRule = async (id)=>{
//     return await axios.request({
//         method:"delete",
//         url:"/role/del",
//         data:{
//             id,
//         },
//     })
// }

// export const editRule = async (data)=>{
//     return await axios.request({
//         method:"put",
//         url:"/role/edit",
//         data,
//     })
// }
export const getOperationSign = async (args) => {
    const json = await fetch('/api/getOperationSign', {
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    const result = await json.json()
    if (result.success) {
        return result.data || true
    }
    return false
}
