module.exports = {
	boundObjectGet: function (url, parameters, response) {
		boundControllerAsync.getJson(url, parameters, response);
	},
	boundObjectPost: function (url, parameters, postData, response) {
		boundControllerAsync.postJson(url, parameters, postData, response);
	}
}
