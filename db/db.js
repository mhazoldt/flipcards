let mysql = require('mysql')
let connection = mysql.createConnection({
    host     : 'localhost',
    database: 'flipcards',
    user     : 'root',
    password : ''
  });

  module.exports = connection