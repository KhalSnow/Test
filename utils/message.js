var request = require('request-promise');

//send_sms(uri,account,password,phone,msg);
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
	var data = await post(uri, content);
}

async function post(uri, content) {
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

