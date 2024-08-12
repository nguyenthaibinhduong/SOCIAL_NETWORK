var mysql = require('mysql');
require('dotenv').config();
var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});
db.connect(function(err) {
    if (err) {
        console.error('Connect Database Fail ' + err.stack);
        return;
    }
    console.log('Connected Database Successfully ' + db.threadId);
});
module.exports = db;
