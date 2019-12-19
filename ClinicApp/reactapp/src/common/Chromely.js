const chromely = {
    get: (url, parameters, response) => {
        boundControllerAsync.getJson(url, parameters, response);
    },
    post: (url, parameters, postData, response) => {
        boundControllerAsync.postJson(url, parameters, postData, response);
    },
};

export default chromely;
