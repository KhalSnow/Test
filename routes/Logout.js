var express = require('express');
var router = express.Router();
var db = require('./db');

/* Log out. */
router.post('/logout', async function(req, res, next) {
	console.log(req.session.username);
	var sql = 'update login set token=?, expired=?, tt=? where username=?';
	var data = await db.query(sql, ['', '', '', req.session.username]);
	res.json({status:0, data:data});
})

module.exports = router;

