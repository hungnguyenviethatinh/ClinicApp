import axios from 'axios';
import { ApiUrl } from '../config';

const Axios = axios.create({
    baseURL: ApiUrl,
    headers: {
        'Access-Control-Allow-Header': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        // 'Authorization': `Bearer `,
    },
});

export default Axios;
