import jwt from 'jsonwebtoken';

import { ApiUrl, Audience, ClientId } from '../config';
import { AccessTokenKey } from '../constants';

export const axiosRequestConfig = () => {
    const token = localStorage.getItem(AccessTokenKey);
    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    return { headers };
};

export const decodeJWT = (token) => jwt.decode(token);

export const verifyJWT = (token, role = null) => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
        return false;
    }

    const expiredDate = new Date(0).setUTCSeconds(decoded.exp);
    const now = new Date().getTime();
    if (expiredDate < now) {
        return false;
    }

    if (!decoded.iss || decoded.iss !== ApiUrl) {
        return false;
    }

    if (!decoded.aud || decoded.aud !== Audience) {
        return false;
    }

    if (!decoded.client_id || decoded.client_id !== ClientId) {
        return false;
    }

    if (role && (!decoded.role || decoded.role !== role)) {
        return false;
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

export { default as ChromeLyService } from './Chromely';
export { default as useInterval } from './UseInterval';
export { default } from './AxiosInstance';
