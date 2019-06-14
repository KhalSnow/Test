var express = require('express');
var router = express.Router();
var db = require('./db');

//用户登录
router.post('/login', async function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	//role为1代表管理员，0为普通用户
	var role = req.body.role;
	//如果用户名或者密码不存在
	if (!username || !password) {
		res.status = '404';
		res.send({
			message: '用户名或密码不存在',
			resultCode: 1
		})
		return;
	}
	//查询数据库
	var sql1 = 'select * from user where username=? and password=?';
	var params1 = [];
	params1.push(req.body.username, req.body.password);
	var data1 = await db.query(sql1, params1);
	if (data1.length != 0) {
		var token = jwt.sign({username: username}, secretkey, {expiresIn: 3600});
		if (role == 1)
			var sql2 = 'update user set token=?, role=1 where username=?';
			var params2 = [req.body.username, token];
			var data2 = await db.query(sql2, params2);
			res.json({
				message: '管理员登录成功',
				resultCode: 0,
				token: token
			});
		if (role == 0) {
			var sql2 = 'update user set token=?, role=0 where username=?';
			var params2 = [req.body.username, token];
			var data2 = await db.query(sql2, params2);
			res.json({
				message: '登录成功',
				resultCode: 0,
				token: token
			});
		}
	} else {
		res.json({
			message: '登录失败，未找到',
			resultCode: 1
		});
	}
})

//拉取用户列表
router.get('getuser', async function(req, res, next) {
	var sql = 'select * from user where 1=1';
	var params = [];
	if (req.query.username) {
		sql += ' and username = ?';
		params.push(req.query.username);
	}
	var data = await db.query(sql, params);
	res.json({
		message: '请求成功',
		resultCode: 0,
		data: data
	});
})

//用户注册
router.get('/register', async function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	if (!username || !password) {
		res.status = '404';
		res.json({
			message: '用户名或密码不存在',
			resultCode: 1
		})
		return;
	}
	var sql1 = 'select * from user where username=? and password=?';
	var params1 = [req.body.username, req.body.password];
	var data1 = await db.query(sql1, params1);
	if (data1.length != 0) {
		res.json({
			message: '注册失败，用户名已存在',
			resultCode: 1
		});
	} else {
		var sql2 = 'insert into user(username, password) values(?,?)';
		var params2 = [req.body.username, req.body.password];
		var data2 = await db.query(sql2, params2);
		res.json({
			message: '注册成功',
			resultCode: 0
		});
	}
})

module.exports = router;

