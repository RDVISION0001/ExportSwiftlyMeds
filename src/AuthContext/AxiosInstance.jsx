import axios from "axios";


const axiosInstance = axios.create({

    // UAT Env
// // <<<<<<< RAJAN
    // baseURL: 'http://192.168.1.7:8083/',
    // baseURL: 'http://192.168.1.13:8081/',
       baseURL: 'http://192.168.1.9:8081/',
// >>>>>>> main
    // For Backend Env
    // baseURL:'https://crmbackend.swiftlymeds.com'
});


export default axiosInstance;
