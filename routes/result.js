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
router.get('/search', async function(req, res, next) {
	var sql = 'select * from result where domain=? and program=?';
	var data = await db.query(sql, [req.query.Domain, req.query.program]);
	res.json({status:0, data:data});
})

/* Get result. */
router.post('/selected', async function(req, res, next) {
    var sql1 = 'select count(*) as count from result where program=?';
	var sql2 = 'select * from result where program=?';
	var params = [req.body.program];
	var data1 = await db.query(sql1, params);
	console.log(data1);
	sql2 += ' order by tt desc';
	sql2 += ' limit 10';
	var data2 = await db.query(sql2, params);
	console.log(data2);
	res.json({status:0, data:[data1[0].count, data2]});
})

/* Get each page's contents. */
router.post('/page', async function(req, res, next) {
	var sql1 = 'select count(*) as count from result where program=?';
	var sql2 = 'select * from result where program=?';
	var params = [req.body.program];
	var data1 = await db.query(sql1, params);
	sql2 += ' order by tt desc';
	sql2 += ' limit ? offset ?';
	params.push(parseInt(req.body.pageSize), (req.body.currentPage-1)*req.body.pageSize);
	var data2 = await db.query(sql2, params);
	res.json({status:0, data:[data1[0].count, data2]});
})

module.exports = router;
