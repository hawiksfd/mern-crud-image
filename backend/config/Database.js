import { Sequelize } from "sequelize";

const db = new Sequelize('crud_image', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;