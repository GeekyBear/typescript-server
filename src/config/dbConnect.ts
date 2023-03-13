import { Sequelize } from "sequelize";
require('dotenv').config();

const dbName = process.env.DB_NAME as string;
const dbUserName = process.env.DB_USERNAME as string;
const dbPassword = process.env.DB_PASSWORD;
const dbHhost = process.env.DB_HOST;
const dbDialect = "postgres"
//const dbPort = process.env.DB_PORT;

const sequelizeConnection = new Sequelize(dbName, dbUserName, dbPassword, {
    host: dbHhost,
    dialect: dbDialect,
});

export default sequelizeConnection;