const boundObjectGet = (url, parameters, response) => {
	boundControllerAsync.getJson(url, parameters, response);
}

const boundObjectPost = (url, parameters, postData, response) => {
	boundControllerAsync.postJson(url, parameters, postData, response);
}

export default {
	boundObjectGet,
	boundObjectPost
}
