import {getConfig} from "../config";
import axios from "axios";
import {generateToken} from "../utils/request";
const config = getConfig()

export const setInfo = async (args) => {
    const json = await fetch(`/api/setInfo`, {
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

export const getUser = async (guild_id, user_id, sign) => {
    const json = await fetch(`/api/getUser/${guild_id}/${user_id}/${sign}`);
    const result = await json.json()
    if (result.success) {
        return result.data || true
    }
    return false
}

export const getConnectedAccount = async (guild_id, user_id) => {
    const json = await fetch(`/api/getConnectedAccount/${guild_id}/${user_id}`);
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
    const json = await fetch(`/api/createParasCollection`, {
        method:"POST",
        body: data
    })
    const result = await json.json()
    console.log(result,'----result----');
    if (result.status == 1) {
        return result.data.collection
    }
    return false
}
export const createSeries = async (data)=>{
    const Authorization = await generateToken()
    const result = await axios.request({
        method:"post",
        url:`${config.PARAS_API}/uploads`,
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
        url:`${config.PARAS_API}/collections?collection_id=${collectionId}`,
    })
    if (result.data.status == 1) {
        return result.data.data
    }
    return false
}

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

export const getMintSign = async (args) => {
    const json = await fetch('/api/getMintSign', {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: typeof args === 'string'?args:JSON.stringify(args)
    })
    const result = await json.json()
    if (result.success) {
        return result.data || true
    }
    return false
}
