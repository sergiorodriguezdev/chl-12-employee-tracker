// Import required modules
const mysql = require('mysql2');

// Connect to MySQL instance
//  Don't forget to update the values below in your environment
const db = mysql.createConnection(
    {
        host: '127.0.0.1', // Update host to your MySQL server
        user: 'root',   // Enter your MySQL username
        password: 'password',   // Enter your password
        database: 'employee_tracker_db'
    }
);

// Export db object containing connection to MySQL
module.exports = db;