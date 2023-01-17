import { Sequelize } from "sequelize";

// hubungkan ke database
// timezone digunakan untuk membuat waktu di indo
const db = new Sequelize("db_pwbs_awonapakarya", "root", "", {
  host: "localhost",
  dialect: "mysql",
  timezone: "+07:00",
});

export default db;
