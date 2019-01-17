var express = require('express');
var router = express.Router();
var db = require('./db');

/* GET home page. */
router.get('/', function(req, res, next) {
	db.query('select * from user', [], function(err, data) {
		if (err) {
			res.json(err);
		} else {
			res.json(data);
		}
	});
});

module.exports = router;

