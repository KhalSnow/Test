var express = require('express');
var router = express.Router();
var db = require('./db');

/* Add info. */
router.post('/add', async function(req, res, next) {
	var sql = 'insert into domain(domain, intervals, member, maximum, enable, program, tag) values(?,?,?,?,?,?,?)';
	var params = [];
	params.push(req.body.domain, req.body.intervals, req.body.member, req.body.maximum, '0', req.body.program, req.body.tag);
	var data = await db.query(sql, params);
	res.json({status:0, msg:'Add successfully.'});
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
	var sql = 'update domain set domain=?, intervals=?, member=?, maximum=?, program=?, tag=?, enable=? where id=?';
	var params = []
	params.push(req.body.domain, req.body.intervals, req.body.member, req.body.maximum, req.body.program, req.body.tag, '0', req.body.id);
	var data = await db.query(sql, params);
	res.json({status:0, msg:'Update Successfully.'});
})

/* Get program. */
router.post('/selected', async function(req, res, next) {
	var sql = 'select * from login where token=?';
	var data = await db.query(sql, [req.headers.token]);
	//console.log(data);
	if (data.length == 0) {
		res.json({status:1, msg:'not log in'});
	} else if (Number(new Date()) > data.expired) {
		res.json({status:2, msg:'expired'});
	} else {
		var sql1 = 'select count(*) as count from domain where program=?';
		var sql2 = 'select * from domain where program=?';
		var params = [req.body.program];
		var data1 = await db.query(sql1, params);
		//console.log(data1);
		sql2 += ' limit 10';
		var data2 = await db.query(sql2, params);
		for (let i=0; i<data2.length; i++) {
			if (data2[i].enable == '1') {
				data2[i].enable = true;
			} else {
				data2[i].enable = false;
			}
		}
		console.log(data2);
		res.json({status:0, data:[data1[0].count, data2], msg:'log in'});
	}
})

/* Get each page's contents. */
router.post('/page', async function(req, res, next) {
	var sql1 = 'select count(*) as count from domain where program=?';
	var sql2 = 'select * from domain where program=?';
	var params = [req.body.program];
	var data1 = await db.query(sql1, params);
	sql2 += ' limit ? offset ?';
	params.push(parseInt(req.body.pageSize), (req.body.currentPage-1)*req.body.pageSize);
	var data2 = await db.query(sql2, params);
	res.json({status:0, data:[data1[0].count, data2]});
})

/* Update enable and tt. */
router.post('/enable', async function(req, res, next) {
	var sql = 'update domain set enable=? where id=?';
	var params = [req.body.enable, req.body.id];
	console.log(req.body.enable);
	var data = await db.query(sql, params);
	res.json({status:0, msg:'Update successfully.', data: req.body.enable});
})

/* Get tag suggestions. */
router.get('/tag', async function(req, res, next) {
	var sql = 'select distinct(tag) as value from domain';
	var data = await db.query(sql, []);
	res.json({status:0, data:data});
})

module.exports = router;

