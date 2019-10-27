import { boundObjectGet } from '../services/chromely.service.js';

const getAppConfig = () => {
    const url = '/democontroller/movies';
    boundObjectGet(url, null, response => {
        console.log('response: ', response);
        const jsonData = JSON.parse(response.ResponseText);
        console.log('jsonData: ', jsonData);
        if (jsonData.ReadyState == 4 && jsonData.Status == 200) {
            console.log('jsonData: ', jsonData);
        } else {
            console.log("An error occurs during message routing. With ur:" + url + ". Response received:" + response);
        }
    });
}

export default getAppConfig();
