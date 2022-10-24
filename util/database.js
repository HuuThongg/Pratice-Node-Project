// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Huuthong@0506'
// })
// module.exports = pool.promise();

const Sequelize = require('sequelize')
const sequelize = new Sequelize('node-complete','root','Huuthong@0506',{dialect:'mysql', host:'localhost'});
module.exports = sequelize;