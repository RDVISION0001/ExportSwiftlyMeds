import axios from "axios";


const axiosInstance = axios.create({

    // UAT Env
    // baseURL: 'http://192.168.1.20:8081/',

    // For Backend Env
   baseURL:'https://crmbackend.swiftlymeds.com'
});


//Add a request interceptor

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authrization'] = `bearer ${token}`;
        } else {
            console.warn('No token found in localStorage');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;