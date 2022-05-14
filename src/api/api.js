import {axios} from "./requst";
import store from "../store/discordInfo";
import {getConfig} from "../config";
const config = getConfig()

export const setInfo = async (data)=>{
    return await axios.request({
        method:"post",
        url:`/setInfo`,
        data,
    })
}
export const signRule = async (args)=>{
    const json = await fetch(`/api/getOwnerSign`,{
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    return await json.json();
}
export const getRoleList = async (guild_id)=>{
    const json = await fetch(`/api/getRole/${guild_id}`);
    return await json.json();
}
export const getServer = async (guild_id)=>{
    const json = await fetch(`/api/getServer/${guild_id}`);
    return await json.json();
}
export const getUser = async (guild_id, user_id) => {
    const json = await fetch(`/api/getUser/${guild_id}/${user_id}`);
    return await json.json();
}
export const getCollectionList = async (guild_id)=>{
    const json = await fetch(`/api/getRole/${guild_id}`);
    return await json.json();
}
export const createCollection = async (data)=>{
    return await axios.request({
        method:"post",
        url:`https://api-v2-${config.networkId}-master.paras.id/collections`,
        data,
    })
}
export const createSeries = async (data)=>{
    return await axios.request({
        method:"post",
        url:`https://api-v2-${config.networkId}-master.paras.id/uploads`,
        data,
    })
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
