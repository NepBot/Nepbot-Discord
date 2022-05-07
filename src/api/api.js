
export const setInfo = async (args) => {
    const json = await fetch(`/api/set-info`, {
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    const result = await json.json()
    if (result.success) {
        return result.data
    }
    return false
}
export const signRule = async (args)=>{
    const json = await fetch(`/api/sign`,{
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    const result = await json.json()
    if (result.success) {
        return result.data
    }
    return false
}
export const getRoleList = async (guild_id)=>{
    const json = await fetch(`/api/getRole/${guild_id}`);
    const result = await json.json()
    if (result.success) {
        return result.data
    }
    return false
}
export const getServer = async (guild_id)=>{
    const json = await fetch(`/api/getServer/${guild_id}`);
    const result = await json.json()
    if (result.success) {
        return result.data
    }
    return false
}
export const getUser = async (guild_id, user_id) => {
    const json = await fetch(`/api/getUser/${guild_id}/${user_id}`);
    const result = await json.json()
    if (result.success) {
        return result.data
    }
    return false
}
export const getOperationSign = async (args) => {
    const json = await fetch('/api/operationSign', {
        headers:{ 'Content-Type': 'application/json' },
        method:"POST",
        body:typeof args === 'string'?args:JSON.stringify(args)
    })
    const result = await json.json()
    if (result.success) {
        return result.data
    }
    return false
}