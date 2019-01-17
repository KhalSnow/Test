var express = require('express');
var router = express.Router();
var db = require('./db');
var md5 = require('md5-node');

/* Check name and password. */
router.post('/login', async function(req, res, next) {
	//console.log(req.headers.token);
	//console.log(req.body);
	var sql1 = 'select * from login where username=? and password=?';
	var params1 = [];
	params1.push(req.body.username, req.body.password);
	var data = await db.query(sql1, params1);
	//console.log(data);
	var string = req.body.username + req.body.password + req.body.datetime;
	var token = md5(string);
	var sql2 = 'update login set token=?, expired=?, tt=? where username=?';
	var params2 = [];
	params2.push(token, (req.body.datetime+86400000), req.body.datetime, req.body.username);
	await db.query(sql2, params2);
	if (data.length != 0) {
		req.session.login = true;
		var result = true;
		res.json({status:0, data:[result, token]});
	} else {
		req.session.login = false;
		var result = false;
		res.json({status:0, data:result});
	}
})

module.exports = router;

