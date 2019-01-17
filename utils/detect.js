var db = require('../routes/db.js');
var request = require('request-promise');
var logger = require('log4js').getLogger();
var message = require('./message.js');

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function send_message(url, mes, phone) {
	var account="N2163466";
	var password="MfObDsz7Nr0a51";
	var uri='http://smssh1.253.com/msg/send/json';
    var phone=phone;
	var msg="【御风运维报警】您的网站 " + url + mes + "请进行查看。";
	await message.send_sms(uri,account,password,phone,msg);
	logger.info(msg);
	console.log(msg);
}

async function profile(url, domain, maximum, phone) {
	var	options = {
		url: url,
		method: 'GET',
		headers: {
		    'Accept-Encoding': 'gzip, deflate, br',
			'Accept-Language': 'zh-CN,zh;q=0.9',
			'Connection': 'keep-alive',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
			'Host': domain
		},
	};
	
	var resp = '';
	try {
		resp = await request(options);
		return resp;
	}
	catch(e) {
		//logger.info(url);
		//logger.info(e);
		//logger.info(resp);
		throw e;
    }
	
	sleep(1000);
}

/*async function manipulation() {
	console.log(response.statusCode);
	if (err) {
		console.log(err);
		logger.info(err);
	} else if (response.statusCode == 200 ) {
		var sql1 = 'insert into result(domain, code, msg) values (?,?,?)';
		var params1 = [url, 0, '正常访问'];
		await db.query(sql1, params1);
	} else if (response.statusCode == 403 ) {
		if (body.search('http://batit.aliyun.com/alww.html') != -1) {
			var sql2 = 'insert into result(domain, code, msg) values (?,?,?)';
			var params2 = [url, 1, '限制访问'];
			await db.query(sql2, params2);
			var sql4 = 'select * from result where domain = ? order by tt desc limit ?';
			var params4 = [url, maximum];
			var data4 = await db.query(sql4, params4);
			console.log(data4);
			if (data4.length < maximum) {
				var mes = " 已经被阿里云限制访问，"
				send_message(url, mes, phone);
			} else {
				for (let i=0; i<maximum; i++) {
					if (data4[i].code != 1) {
						var mes = " 已经被阿里云限制访问，";
						send_message(url, mes, phone);
						break;
					} else {
						continue;
					}
				}
			}
		}
	} else if (response.statusCode == 500 ) {
		var sql3 = 'insert into result(domain, code, msg) values (?,?,?)';
		var params3 = [url, 2, '服务器宕机'];
		await db.query(sql3, params3);
		var mes = " 服务器宕机，"
		send_message(url, mes, phone);
	}
}*/

async function main() {
	var currentTime = new Date().getMinutes();
	var sql = 'select * from domain where enable = 1';
	var data = await db.query(sql, []);
	var domain = [];
	var maximum = [];
	var phone = [];
	for (let i=0; i<data.length; i++) {
		if (currentTime % data[i].intervals == 0) {
			domain.push(data[i].domain);
			maximum.push(data[i].maximum);
			phone.push(data[i].member);
		}
	}
	console.log(domain);

	for (let i=0; i<domain.length; i++) {
		let url = 'http://' + domain[i];
		let resp = await profile(url, domain[i], maximum[i], phone[i]);
		console.log(resp);
		console.log(resp.statusCode);
		//await function manipulation();
	}
	process.exit(0);
}

main();

