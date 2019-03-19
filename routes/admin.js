var express = require('express');
var router = express.Router();
var db = require('./db');

/* Get menu. */
router.get('/get', async function(req, res, next) {
	var sql = 'select * from program';
	var data = await db.query(sql, []);	
	//for(let i=0; i<data.length; i++) {
	//	data[i].route = '/program?type=' + data[i].id;
	//}
	console.log(data);
	res.json({status:0, data:data});
})

/* Add menu. */
router.post('/add', async function(req, res, next) {
	var sql1 = 'select max(id) as max from program';
	var data1 = await db.query(sql1, []);
	console.log(data1[0].max);
	var sql2 = 'insert into program(name, description, type, route) values(?,?,?,?)';
	var params2 = [];
	params2.push(req.body.name, req.body.description, data1[0].max+1, '/program?type='+(data1[0].max+1));
	var data2 = db.query(sql2, params2);
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
	var data1 = await db.query(sql1, [req.body.type]);
	if ( data1.length==0 ) {
		var sql = 'delete from program where id=?';
		var data = await db.query(sql, [req.body.id]);
		res.json({status:0, msg:'Delete successfully.'});
	} else {
		res.json({status:1, msg:'Can not delete.'})
	}
})

module.exports = router;

