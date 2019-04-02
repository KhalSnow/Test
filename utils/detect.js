var db = require('../routes/db.js');
var request = require('request-promise');
var logger = require('log4js').getLogger();
var Message = require('./message.js');
async function send_message(programName, phone, message, url) {
	var account="N2163466";
	var password="MfObDsz7Nr0a51";
	var uri='http://smssh1.253.com/msg/variable/json';
	var msg="【御风运维报警】{$var}域名{$var}出现故障，原因是：{$var}，请及时检查";
	var params = phone + "," + programName + "," + url + "," + message;
	console.log(params);
	var data = await Message.send_sms(account,password,msg,params,uri);
	logger.info(msg);
	//console.log(msg);
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
		var Status1 = '正常访问';
		var code1 = 0;
		await insertResult(url, code1, Status1, program);
		await updateStatus(Status1, domain);
	} else if (statusCode == 403) {
		if (body.search('http://batit.aliyun.com/alww.html') != -1) {
			var Status2 = '限制访问';
			var code2 = 1;
			var sql = 'select * from result where domain = ? order by tt desc limit ?';
			var params = [url, maximum];
			var data = await db.query(sql, params);
			if (data.length < maximum) {
				var message = "被阿里云限制访问";
				await insertResult(url, code2, Status2, program);
				await send_message(programName, phone, message, url);
				await updateStatus(Status2, domain);
			} else {
				var flag = false;
				for (let i=0; i<maximum; i++) {
					if (data[i].code != 1) {
						flag = true;
						break;
					} else {
						continue;
					}
				}
				if (flag) {
					var message = "被阿里云限制访问";
					await send_message(programName, phone, message, url);
					await insertResult(url, code2, Status2, program);
					await updateStatus(Status2, domain);
				} else {
					await insertResult(url, code2, Status2, program);
					await updateStatus(Status2, domain);
					await setEnable(domain);
				}
			}
		}
	} else if (statusCode == 500 ) {
		var Status3 = '服务器宕机';
		var code3 = 2;
		if (data.length < maximum) {
			var message = "因服务器宕机停止使用";
			await insertResult(url, code3, Status3, program);
			await send_message(programName, phone, message, url);
			await updateStatus(Status3, domain);
		} else {
			for (let i=0; i<maximum; i++) {
				if (data6[i].code != 2) {
					var message = "因服务器宕机停止使用";
					await insertResult(url, code3, Status3, program);
					await send_message(programName, phone, message, url);
					await updateStatus(Status3, domain);
					break;
				} else {
					continue;
				}
				await setEnable(domain);
			}
		}
	}
}

async function insertResult(url, code, Status, program) {
	var sql = 'insert into result(domain, code, msg, program) values (?,?,?,?)';
	var params = [url, code, Status, program];
	var data = await db.query(sql, params);
	return data;
}

async function updateStatus(Status, domain) {
	var sql = 'update domain set status=? where domain=?';
	var data = await db.query(sql, [Status, domain]);
	return data;
}

async function setEnable(domain) {
	var sql = 'update domain set enable=0 where domain=?';
	var data = await db.query(sql, [domain]);
	return data;
}

async function main() {
	var currentTime = new Date().getMinutes();
	var sql1 = 'select * from domain where enable = 1';
	var data1 = await db.query(sql1, []);
	console.log(data1);
	var sql2 = 'select name from program';
	var data2 = await db.query(sql2, []);
	var [domain, maximum, phone, program, programName] = [[], [], [], [], []];
	for (let i=0; i<data1.length; i++) {
		if (currentTime % data1[i].intervals == 0) {
			domain.push(data1[i].domain);
			maximum.push(data1[i].maximum);
			phone.push(data1[i].member);
			program.push(data1[i].program);
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

