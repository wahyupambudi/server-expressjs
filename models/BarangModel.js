import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";

// destruct datatype
const { DataTypes } = Sequelize;

const Barangs = db.define(
  "tb_barang",
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
    kd_brg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nm_brg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    spek_brg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jml_brg: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kondisi_brg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tgl_buy_brg: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    harga_brg: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Barangs);
Barangs.belongsTo(Users, { foreignKey: "userId" });

export default Barangs;
