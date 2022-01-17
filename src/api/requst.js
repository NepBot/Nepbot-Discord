import axios from "axios";
// const baseUrl = 'http://127.0.0.1:5000/api';

//  axios 
const service = axios.create({
    //baseURL: '/buuBigData',
    baseURL: '/api', // api base_url
    // baseURL: baseProject, // api base_url
    timeout: 900000 // 
})

service.interceptors.response.use((response)=>{
    return response.data;
},err=>{
    // notification.error({
    //     message: '',
    //     description: err,
    //     duration: 4
    // })
})

export {
    service as axios
}
