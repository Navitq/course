const { Pool } = require('pg');

const pool = new Pool({
    user: 'navitq',
    password: 'qwerty123',
    host: '127.0.0.1',
    port: 5432,
    database: 'course'

});

module.exports = {
    query: (text, params) => pool.query(text, params)
};