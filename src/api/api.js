import {axios} from "./requst";
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
export const getOperationSign = async (args) => {
    const json = await fetch('/api/operationSign', {
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    return await json.json()
}