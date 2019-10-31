const Get = (url, parameters, response) => {
	boundControllerAsync.getJson(url, parameters, response);
}

const Post = (url, parameters, postData, response) => {
	boundControllerAsync.postJson(url, parameters, postData, response);
}

export default {
	Get,
	Post
}
