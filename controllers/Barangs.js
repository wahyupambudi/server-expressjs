import Barang from "../models/BarangModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getBarangs = async (req, res) => {
  try {
    let response;
    // req.role berasal dari middleware ketika login
    if (req.role === "admin") {
      response = await Barang.findAll({
        attributes: [
          "uuid",
          "kd_brg",
          "nm_brg",
          "spek_brg",
          "jml_brg",
          "kondisi_brg",
          "tgl_buy_brg",
          "harga_brg",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Barang.findAll({
        attributes: [
          "uuid",
          "kd_brg",
          "nm_brg",
          "spek_brg",
          "jml_brg",
          "kondisi_brg",
          "tgl_buy_brg",
          "harga_brg",
        ],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBarangById = async (req, res) => {
  try {
    const barang = await Barang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    // jika barang tidak ditemukan
    if (!barang) return res.status(404).json({ msg: "Data Tidak Ditemukan" });

    let response;
    // req.role berasal dari middleware ketika login
    if (req.role === "admin") {
      response = await Barang.findOne({
        attributes: [
          "uuid",
          "kd_brg",
          "nm_brg",
          "spek_brg",
          "jml_brg",
          "kondisi_brg",
          "tgl_buy_brg",
          "harga_brg",
        ],
        where: {
          id: barang.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Barang.findOne({
        attributes: [
          "uuid",
          "kd_brg",
          "nm_brg",
          "spek_brg",
          "jml_brg",
          "kondisi_brg",
          "tgl_buy_brg",
          "harga_brg",
        ],
        where: {
          // select berdasarkan id dan user id yang login
          [Op.and]: [{ id: barang.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBarang = async (req, res) => {
  const {
    kd_brg,
    nm_brg,
    spek_brg,
    jml_brg,
    kondisi_brg,
    tgl_buy_brg,
    harga_brg,
  } = req.body;

  // mendapatkan semua kode barang
  const getBarangAll = await Barang.findAll();
  for (let i = 0; i < getBarangAll.length; i++) {
    // console.log(getBarangAll[i].kd_brg);
    let new_kd_brg = getBarangAll[i].kd_brg;
    // jika kd_brg sama
    if (new_kd_brg === kd_brg)
      return res.status(500).json({ msg: "Kode Barang Tidak Boleh sama" });
  }

  // proses create barang
  try {
    await Barang.create({
      kd_brg: kd_brg,
      nm_brg: nm_brg,
      spek_brg: spek_brg,
      jml_brg: jml_brg,
      kondisi_brg: kondisi_brg,
      tgl_buy_brg: tgl_buy_brg,
      harga_brg: harga_brg,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Data Barang Berhasil di Simpan." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBarang = async (req, res) => {
  try {
    // mendapatkan kodebarang sesuai id
    const barang = await Barang.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // jika barang tidak ditemukan
    if (!barang)
      return res.status(404).json({ msg: "Data Barang Tidak Ditemukan" });

    // jika barang ditemukan ambil data dar req body
    const {
      kd_brg,
      nm_brg,
      spek_brg,
      jml_brg,
      kondisi_brg,
      tgl_buy_brg,
      harga_brg,
    } = req.body;

    // req.role berasal dari middleware ketika login
    if (req.role === "admin") {
      await Barang.update(
        {
          kd_brg,
          nm_brg,
          spek_brg,
          jml_brg,
          kondisi_brg,
          tgl_buy_brg,
          harga_brg,
        },
        {
          where: {
            id: barang.id,
          },
        }
      );
    } else {
      // jika user id dan barang user id tidak sama
      if (req.userId !== barang.userId)
        return res.status(403).json({ msg: "Akses Tidak ditemukan" });
      // jika kondisi terpenuhi
      await Barang.update(
        {
          kd_brg,
          nm_brg,
          spek_brg,
          jml_brg,
          kondisi_brg,
          tgl_buy_brg,
          harga_brg,
        },
        {
          where: {
            [Op.and]: [{ id: barang.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Barang Berhasil di Update" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBarang = async (req, res) => {
  try {
    // mendapatkan kodebarang sesuai id
    const barang = await Barang.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // jika barang tidak ditemukan
    if (!barang)
      return res.status(404).json({ msg: "Data Barang Tidak Ditemukan" });

    // req.role berasal dari middleware ketika login
    if (req.role === "admin") {
      await Barang.destroy({
        where: {
          id: barang.id,
        },
      });
    } else {
      // jika user id dan barang user id tidak sama
      if (req.userId !== barang.userId)
        return res.status(403).json({ msg: "Akses Tidak ditemukan" });
      // jika kondisi terpenuhi
      await Barang.destroy({
        where: {
          [Op.and]: [{ id: barang.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Barang Berhasil di Hapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
