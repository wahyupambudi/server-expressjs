import { Sequelize } from "sequelize";
import db from "../config/database.js";

// describe datatype
const { DataTypes } = Sequelize;

// membuat table users
const Users = db.define(
  "users",
  {
    uuid: {
      type: DataTypes.STRING,
      // membuat uuid secara otomatis
      defaultValue: DataTypes.UUIDV4,
      // tidak boleh kosong
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Users;
