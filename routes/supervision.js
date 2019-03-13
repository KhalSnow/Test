var express = require('express');
var router = express.Router();
var db = require('./db');

/* Update enable and tt. */
router.post('/enable', async function(req, res, next) {
	var sql = 'update domain set enable=? where id=?';
	var params = [req.body.enable, req.body.id];
	await db.query(sql, params);
	res.json({status:0, msg:'Update successfully.', data: req.body.enable});
})

module.exports = router;
