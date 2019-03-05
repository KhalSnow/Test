var express = require('express');
var router = express.Router();
var db = require('./db');

/* Get result. 
router.get('/get', async function(req, res, next) {
	var sql = 'select * from result where program=?';
	var data = await db.query(sql, [req.query.program]);
	res.json({status:0, data:data});
})*/

/* Search result. */
router.post('/search', async function(req, res, next) {
	console.log(req.query);
	var sql1 = 'select count(*) as count from result where program=?';
	var sql2 = 'select * from result where program=?';
	var params = [];
	params.push(req.query.program);
	if (req.query.Domain) {
		sql1 += ' and domain=?';
		sql2 += ' and domain=?';
		params.push(req.query.Domain);
	}
	console.log(params);
	var data1 = await db.query(sql1, params);
	console.log(data1);
	sql2 += ' order by tt desc';
	sql2 += ' limit ? offset ?';
	params.push(parseInt(req.query.pageSize), (req.query.currentPage-1)*req.query.pageSize);
	var data2 = await db.query(sql2, params);
	res.json({status:0, data:[data1[0].count, data2]});
})

/* Get result. */
router.post('/selected', async function(req, res, next) {
    var sql1 = 'select count(*) as count from result where program=?';
	var sql2 = 'select * from result where program=?';
	var params = [req.body.program];
	console.log(params);
	var data1 = await db.query(sql1, params);
	sql2 += ' order by tt desc limit 10';
	var data2 = await db.query(sql2, params);
	console.log(data2);
	res.json({status:0, data:[data1[0].count, data2]});
})

/* Get each page's contents. */
router.post('/page', async function(req, res, next) {
	console.log(req.body);
	var sql1 = 'select count(*) as count from result where program=?';
	var sql2 = 'select * from result where program=?';
	var params = [];
	params.push(req.body.program);
	if (req.body.Domain) {
		sql1 += ' and domain=?';
		sql2 += ' and domain=?';
		params.push(req.body.Domain);
	}
	var data1 = await db.query(sql1, params);
	console.log(data1);
	sql2 += ' order by tt desc';
	sql2 += ' limit ? offset ?';
	params.push(parseInt(req.body.pageSize), (req.body.currentPage-1)*req.body.pageSize);
	var data2 = await db.query(sql2, params);
	res.json({status:0, data:[data1[0].count, data2]});
})

module.exports = router;
