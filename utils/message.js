var request = require('request-promise');

// API账号
//var account="N2163466";
// API密码
//var password="MfObDsz7Nr0a51";
//接口域名
//var uri = 'http://smssh1.253.com/msg/send/json';
//手机号码
//var phone="17712082178";
// 设置您要发送的内容：其中“【】”中括号为运营商签名符号，多签名内容前置添加提交
//var msg="【御风运维报警】您的网站已经被阿里云限制访问，请进行查看";

//send_sms(uri,account,password,phone,msg);
// 发送短信方法
module.exports.send_sms = async function(uri,account,password,phone,msg){
	var post_data = { // 这是需要提交的数据
		"account": account,
		"password": password,
		"phone": phone,
		"msg": msg,
		"report": true
	};
	console.log(post_data);
	var content = post_data;
	await post(uri, content);
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

