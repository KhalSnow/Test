var db = require('../routes/db.js');
var request = require('request-promise');
var logger = require('log4js').getLogger();
var Message = require('./message.js');

async function send_message(programName, phone, message, url) {
	var account="N2163466";
	var password="MfObDsz7Nr0a51";
	var uri='http://smssh1.253.com/msg/variable/json';
	var msg="【御风运维报警】" + programName + "域名" + url + "出现故障：" + message + "请及时更新。";
	var params = phone + "," + url + "," + message + "," + programName;
	console.log(params);
	var data = await Message.send_sms(account,password,msg,params,url);
	logger.info(msg);
	console.log(msg);
}

async function profile(url, domain) {
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
		resolveWithFullResponse: true,
		simple: false
	};
	
	var resp = '';
	try {
		resp = await request(options);
		return resp;
	}
	catch(e) {
		logger.info(url);
		logger.info(e);
		logger.info(resp);
		throw e;
    }
}

async function manipulation(body, statusCode, url, domain, maximum, phone, program, programName) {
	if (statusCode == 200) {
		var sql1 = 'insert into result(domain, code, msg, program) values (?,?,?,?)';
		var params1 = [url, 0, '正常访问', program];
		var data1 = await db.query(sql1, params1);
	} else if (statusCode == 403) {
		if (body.search('http://batit.aliyun.com/alww.html') != -1) {
			var sql2 = 'insert into result(domain, code, msg, program) values (?,?,?,?)';
			var params2 = [url, 1, '限制访问', program];
			var data2 = await db.query(sql2, params2);
			var sql4 = 'select * from result where domain = ? order by tt desc limit ?';
			var params4 = [url, maximum];
			var data4 = await db.query(sql4, params4);
			if (data4.length < maximum) {
				var message = "被阿里云限制访问，";
				await send_message(programName, phone, message, url);
			} else {
				for (let i=0; i<maximum; i++) {
					if (data4[i].code != 1) {
						var message = "被阿里云限制访问，";
						await send_message(programName, phone, message, url);
						break;
					} else {
						continue;
					}
				}
			}
		}
	} else if (statusCode == 500 ) {
		var sql3 = 'insert into result(domain, code, msg, program) values (?,?,?,?)';
		var params3 = [url, 2, '服务器宕机'];
		var data3 = await db.query(sql3, params3);
		if (data3.length < maximum) {
			var message = "因服务器宕机停止使用，";
			await send_message(programName, phone, message, url);
		} else {
			for (let i=0; i<maximum; i++) {
				if (data3[i].code != 2) {
					var message = "因服务器宕机停止使用，";
					await send_message(programName, phone, message, url);
					break;
				} else {
					continue;
				}
			}
		}
	}
}

async function main() {
	var currentTime = new Date().getMinutes();
	var sql1 = 'select * from domain where enable = 1';
	var data1 = await db.query(sql1, []);
	console.log(data1);
	var sql2 = 'select name from program';
	var data2 = await db.query(sql2, []);
	console.log(data2);
	var [domain, maximum, phone, program, programName] = [[], [], [], [], []];
	for (let i=0; i<data1.length; i++) {
		if (currentTime % data1[i].intervals == 0) {
			domain.push(data1[i].domain);
			maximum.push(data1[i].maximum);
			phone.push(data1[i].member);
			program.push(data1[i].program);
			console.log(data1[i].program-1);
			programName.push(data2[data1[i].program-1].name);
		}
	}
	console.log(programName);

	for (let i=0; i<domain.length; i++) {
		let url = 'http://' + domain[i];
		let resp = await profile(url, domain[i]);
		let body = resp.body;
		let statusCode = resp.statusCode;
		try {
			await manipulation(body, statusCode, url, domain[i], maximum[i], phone[i], program[i], programName[i]);
		} catch(err) {
			console.log(err);
		}
	}
	process.exit(0);
}

main();

