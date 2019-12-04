import jwt from 'jsonwebtoken';
import { ApiUrl, Audiance, ClientId } from '../config';

export const axiosConfig = () => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
    };
    return config;
};

export const axiosConfigJson = () => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
        }
    };
    return config;
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

export const encodeFileToBase64 = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.readAsDataURL(file);
    });
};

export { default } from './AxiosInstance';
