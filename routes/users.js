var express = require('express');
var router = express.Router();
var db = require('./db');

/* Add info. */
router.post('/add', async function(req, res, next) {
	var sql = 'insert into domain(domain, intervals, member, maximum) values(?,?,?,?)';
	//console.log(req.body);
	var params = [];
	params.push(req.body.domain, req.body.intervals, req.body.member, req.body.maximum);
	console.log(params);
	var data = await db.query(sql, params);
	res.json({status:0, msg:'Add successfully.'});
})

/* Get info. */
router.get('/get', async function(req, res, next) {
	var sql1 = 'select * from login where token=?';
	var params1 = [req.headers.token];
	var data1 = await db.query(sql1, params1);
	if (data1.length != 0) {
		//console.log(Number(new Date()));
		//console.log(data1[0].expired);
		if (Number(new Date()) < data1[0].expired) {
			var sql2 = 'select * from domain';
			var data2 = await db.query(sql2, []);
			res.json({status:0, data:data2});
		} else {
			res.json({status:1, code:401});
		}
	} else {
		res.json({status:1, code:400});
	}
})

/* Delete info. */
router.post('/delete', async function(req, res, next) {
	var sql = 'delete from domain where id=?';
	var params = [req.body.id];
	var data = await db.query(sql, params);
	res.json({status:0, msg:'Delete successfully.'});
})

/* Edit info. */
router.post('/edit', async function(req, res, next) {
	var sql = 'update domain set domain=?, intervals=?, member=?, maximum=? where id=?';
	var params = []
	params.push(req.body.domain, req.body.intervals, req.body.member, req.body.maximum, req.body.id);
	var data = await db.query(sql, params);
	res.json({status:0, msg:'Update Successfully.'});
})

module.exports = router;
