var request = require('request-promise');

// 发送短信方法
module.exports.send_sms = async function(account,password,msg,params,uri){
	var post_data = { // 这是需要提交的数据
		"account": account,
		"password": password,
		"msg": msg,
		"params": params,
		"report": true
	};
	console.log(post_data);
	var content = post_data;
	await post(content,uri);
}

async function post(content,uri) {
	var options = {
		url: uri,
		method: 'POST',
		json: true,
		body: content,
		headers: {
			"Content-Type": "application/json; charset=UTF-8"
		}
	};
	var req = '';
	req = await request(options, async function (err, response, body) {
		if (err) {
			console.log(err);
		}
		console.log('STATUS: ' + response.statusCode);
		console.log(body);
	});
}

