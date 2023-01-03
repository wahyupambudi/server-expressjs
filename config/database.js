import { Sequelize } from "sequelize";

const db = new Sequelize("db_pwbs_awonapakarya", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
