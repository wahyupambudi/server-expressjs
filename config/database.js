import { Sequelize } from "sequelize";

const db = new Sequelize("db_pwbs_awonapakarya", "root", "", {
  host: "localhost",
  dialect: "mysql",
  timezone: "+07:00",
});

export default db;
