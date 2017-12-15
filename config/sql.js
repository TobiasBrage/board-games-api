const mysql = require('mysql2');

module.exports = {
    'connect': () => {
        return mysql.createConnection({
            'host': '165.227.173.142',
            'user': 'root',
            'password': '73c-test',
            'port': 3306,
            'database': 'boardGames'
        });
    }
};