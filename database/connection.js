const oracledb = require("oracledb");
// Oracle database connection configuration
const dbConfig = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  connectString: process.env.DATABASE_CONN_STRING,
};

const getConnection = async () => await oracledb.getConnection(dbConfig);

module.exports = getConnection;
