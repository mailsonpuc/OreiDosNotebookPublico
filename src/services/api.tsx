import axios from "axios"

export const api = axios.create({
    baseURL: "https://apinotebook-ehd3cuabdpazh8bs.canadacentral-01.azurewebsites.net"
})