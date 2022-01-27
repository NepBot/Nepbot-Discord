import {axios} from "./requst";
import store from "../store/discordInfo";
export const setInfo = async (data)=>{
    return await axios.request({
        method:"post",
        url:`/set-info`,
        data,
    })
}
export const signRule = async (args)=>{
    const json = await fetch(`/api/sign`,{
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    return await json.json();
}
export const getRoleList = async ()=>{
    const json = await fetch(`/api/getRole/${store.get('guild_id')}`);
    return await json.json();
}
export const getServer = async ()=>{
    const json = await fetch(`/api/getServer/${store.get('guild_id')}`);
    return await json.json();
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
