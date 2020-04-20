module.exports = {
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSW,
  database: process.env.MYSQL_DEFAULT_DB,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
  define: {
    timestamps: true,
  },
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}
