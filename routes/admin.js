var express = require('express');
var router = express.Router();
var db = require('./db');

/* Get menu. */
router.get('/get', async function(req, res, next) {
	var sql = 'select * from program';
	var data = await db.query(sql, []);
	for( let i=0; i<data.length; i++ ) {
		data[i].route = '/program?type=' + data[i].id;
	}
	res.json({status:0, data:data});
})

/* Add menu. */
router.post('/add', async function(req, res, next) {
	var sql = 'insert into program(name, description) values(?,?)';
	var params = [];
	params.push(req.body.name, req.body.description);
	var data = db.query(sql, params);
	res.json({status:0, msg:'Add successfully.'});
})

/* Edit menu. */
router.post('/edit', async function(req, res, next) {
	var sql = 'update program set name=?, description=? where id=?';
	var params = [];
	params.push(req.body.name, req.body.description, req.body.id);
	var data = await db.query(sql, params);
	res.json({status:0, msg: 'Edit successfully.'});
})

/* Delete menu. */
router.post('/delete', async function(req, res, next) {
	var sql1 = 'select * from domain where program=?';
	var data1 = await db.query(sql1, [req.body.id]);
	if ( data1.length==0 ) {
		var sql = 'delete from program where id=?';
		var data = await db.query(sql, [req.body.id]);
		res.json({status:0, msg:'Delete successfully.'});
	} else {
		res.json({status:1, msg:'Can not delete.'})
	}
})

/* Get each page's contents. */
router.get('/page', async function(req, res, next) {
	var sql1 = 'select count(*) as count from program';
	var sql2 = 'select * from program limit ? offset ?';
	var params2 = [];
	params2.push(parseInt(req.query.pageSize), (req.query.currentPage-1)*req.query.pageSize);
	var data1 = await db.query(sql1, []);
	var data2 = await db.query(sql2, params2);
	for( let i=0; i<data2.length; i++ ) {
		data2[i].route = '/program?type=' + data2[i].id;
	}
	res.json({status:0, data:[data1[0].count, data2]});
})

module.exports = router;

