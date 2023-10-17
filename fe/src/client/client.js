import axios from "axios";
class AxiosClient {
    constructor(){
        const baseURL = `${process.env.REACT_APP_URL_ENDPOINT}`

        this.axiosInstance = axios.create({
            baseURL: baseURL,
        })
    }


    // Client per la GET
    async get(url, config) {
        const response = await this.axiosInstance.get(url, config)
        return response.data
    }
    
    // Client per la POST
    async post(url, body, config) {
        const response = await this.axiosInstance.post(url, body, config)
        return response.data
    }
}

export default AxiosClient;