var mysql = require("mysql2/promise");
var pool = mysql.createPool({
	host : 'localhost',
	user : 'wangyh',
	password : 'wangyh',
	database : 'supervision',
	charset : 'utf8',
	insecureAuth: true
});

module.exports.query = async function(sql, params) {
	var conn = await pool.getConnection();
	let [rows, fields] = await conn.execute(sql, params);
	conn.release();
	return rows;
}
