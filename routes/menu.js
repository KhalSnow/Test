var express = require('express');
var router = express.Router();
var db = require('./db');

/* Get menu. */
router.get('/get', async function(req, res, next) {
	var sql = 'select * from program';
	var data = await db.query(sql, []);	
	res.json({status:0, data:data});
})

/* Add menu. */
router.post('/add', async function(req, res, next) {
	var sql1 = 'insert into program(name, type, route) values(?,?,?)';
	var params1 = [];
	params1.push(req.body.name, req.body.type, '/program?type='+req.body.type);
	var data1 = await db.query(sql1, params1);
	var sql2 = 'select * from program';
	var data2 = await db.query(sql2, []);
	res.json({status:0, data:data2, msg:'Add successfully.'});
})

/* Delete menu. */
router.post('/delete', async function(req, res, next) {
	var sql1 = 'delete from program where type=?';
	var data1 = await db.query(sql1, [req.body.type]);
	var sql2 = 'select * from program';
	var data2 = await db.query(sql2, []);
	res.json({status:0, data:data2, msg:'Delete successfully.'});
})

module.exports = router;

