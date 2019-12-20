import { chromely } from '../common';
import { GetAppConfigurationUrl } from '.';

const getAppConfiguration = () => {
    const config = {
        ApiUrl: '',
        Secret: '',
    };

    chromely.get(GetAppConfigurationUrl, null, response => {
        const { ResponseText } = response;
        const { ReadyState, Status, Data } = JSON.parse(ResponseText);
        if (ReadyState === 4 && Status === 200) {
            Object.assign(config, Data);
        } else {
            console.log('[Get App Configuration Error] - An error occurs during message routing. With url: '
                + GetAppConfigurationUrl
                + '. Response received: ', response);
        }
    });

    return config;
};

export default getAppConfiguration;
