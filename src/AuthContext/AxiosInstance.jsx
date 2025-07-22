import axios from "axios";


const axiosInstance = axios.create({

    // UAT Env
    baseURL: 'http://192.168.1.7:8083/',
    // For Backend Env
    //    baseURL:'https://crmbackend.swiftlymeds.com'
});
s

export default axiosInstance;