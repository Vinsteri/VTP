const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'mydatabase',
  multipleStatements: true
});

connection.connect(function (err) {
  if (err) {
    console.error('Error connecting to database:', err);
    setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
  } else {
    console.log('Connected to the database.');
  }
});

module.exports = {
  query: (sql, values) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};