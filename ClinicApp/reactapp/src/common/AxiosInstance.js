import axios from 'axios';
import { ApiUrl } from '../config';

const Axios = axios.create({
    baseURL: ApiUrl,
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Access-Control-Allow-Header': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Content-Type': 'application/json',
    },
});

export default Axios;
