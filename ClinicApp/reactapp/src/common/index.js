import jwt from 'jsonwebtoken';

import { ApiUrl, Audiance, ClientId } from '../config';
import { AccessTokenKey } from '../constants';

export const axiosRequestConfig = () => {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem(AccessTokenKey)}`,
    };
    return { headers };
};

export const decodeJWT = (token) => jwt.decode(token);

export const verifyJWT = (token, role = null) => {
    const decoded = decodeJWT(token);
    if (!decoded) {
        return false;
    }
    if (!decoded.hasOwnProperty('exp')) {
        return false;
    } else {
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        if (date < new Date().getTime()) {
            return false;
        }
    }
    if (!decoded.hasOwnProperty('iss')) {
        return false;
    } else {
        if (ApiUrl !== decoded.iss) {
            return false;
        }
    }
    if (!decoded.hasOwnProperty('aud')) {
        return false;
    } else {
        if (Audiance !== decoded.aud) {
            return false;
        }
    }
    if (!decoded.hasOwnProperty('client_id')) {
        return false;
    } else {
        if (ClientId !== decoded.client_id) {
            return false;
        }
    }
    if (role) {
        if (!decoded.hasOwnProperty('role')) {
            return false;
        } else {
            if (role !== decoded.role) {
                return false;
            }
        }
    }

    return true;
};

export const encodeFileToBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        resolve(event.target.result);
    };
    reader.readAsDataURL(file);
});

export { default as chromely } from './Chromely';
export { default as useInterval } from './UseInterval';
export { default } from './AxiosInstance';
