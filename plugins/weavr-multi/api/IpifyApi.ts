import { AxiosResponse } from "axios";

const axios = require("axios");

export class IpifyApi {
    get(): Promise<AxiosResponse<{ ip: string }>> {
        return axios.get("https://api.ipify.org/?format=json");
    }
}
