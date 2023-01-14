import Jbarang from "../models/JbarangModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

export const getJbarangs = async (req, res) => {
  try {
    let response;
    // req.role berasal dari middleware ketika login
    if (req.role === "admin") {
      response = await Jbarang.findAll({
        attributes: [
          "uuid",
          "kd_jbrg",
          "nm_jbrg",
          "spek_jbrg",
          "jml_jbrg",
          "kondisi_jbrg",
          "tgl_buy_jbrg",
          "harga_jbrg",
          "image",
          "url",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Jbarang.findAll({
        attributes: [
          "uuid",
          "kd_jbrg",
          "nm_jbrg",
          "spek_jbrg",
          "jml_jbrg",
          "kondisi_jbrg",
          "tgl_buy_jbrg",
          "harga_jbrg",
          "image",
          "url",
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

export const getJbarangById = async (req, res) => {
  try {
    const jbarang = await Jbarang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    // jika jbarang tidak ditemukan
    if (!jbarang) return res.status(404).json({ msg: "Data Tidak Ditemukan" });

    let response;
    // req.role berasal dari middleware ketika login
    // jika user admin menampilkan berdasarkan id jbarang dari semua user
    if (req.role === "admin") {
      response = await Jbarang.findOne({
        attributes: [
          "uuid",
          "kd_jbrg",
          "nm_jbrg",
          "spek_jbrg",
          "jml_jbrg",
          "kondisi_jbrg",
          "tgl_buy_jbrg",
          "harga_jbrg",
          "image",
          "url",
        ],
        where: {
          id: jbarang.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    // jika user menampilkan berdasarkan id jbarang dari userid
    else {
      response = await Jbarang.findOne({
        attributes: [
          "uuid",
          "kd_jbrg",
          "nm_jbrg",
          "spek_jbrg",
          "jml_jbrg",
          "kondisi_jbrg",
          "tgl_buy_jbrg",
          "harga_jbrg",
          "image",
          "url",
        ],
        where: {
          // select berdasarkan id dan user id yang login
          [Op.and]: [{ id: jbarang.id }, { userId: req.userId }],
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

export const createJbarang = async (req, res) => {
  // mendapatkan data input dari form
  const {
    kd_jbrg,
    nm_jbrg,
    spek_jbrg,
    jml_jbrg,
    kondisi_jbrg,
    tgl_buy_jbrg,
    harga_jbrg,
  } = req.body;

  // mendapatkan semua kode barang
  const getJbarangAll = await Jbarang.findAll();
  for (let i = 0; i < getJbarangAll.length; i++) {
    // console.log(getJbarangAll[i].kd_jbrg);
    let new_kd_jbrg = getJbarangAll[i].kd_jbrg;
    // jika kd_jbrg sama
    if (new_kd_jbrg === kd_jbrg)
      return res.status(500).json({ msg: "Kode Barang Tidak Boleh sama" });
  }

  // check jika file kosong
  if (req.files === null)
    return res.status(400).json({ msg: "Tidak ada file yang di upload" });

  // membuat variabel untuk menampung data gambar
  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = Date.now() + "-" + file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/jbarang/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  // membuat kondisi jika variabel allowedType dan jika fileSize
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Gambar tidak sesuai" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Ukuran gambar harus dibawah 5MB" });

  // jika kondisi benar maka akan melakukan proses simpan data
  file.mv(`./public/images/jbarang/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    // proses create barang
    try {
      await Jbarang.create({
        kd_jbrg: kd_jbrg,
        nm_jbrg: nm_jbrg,
        spek_jbrg: spek_jbrg,
        jml_jbrg: jml_jbrg,
        kondisi_jbrg: kondisi_jbrg,
        tgl_buy_jbrg: tgl_buy_jbrg,
        harga_jbrg: harga_jbrg,
        image: fileName,
        url: url,
        userId: req.userId,
      });
      res.status(201).json({ msg: "Data Barang Berhasil di Simpan." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

export const updateJbarang = (req, res) => {};

export const deleteJbarang = async (req, res) => {
  try {
    // mendapatkan kodebarang sesuai id
    const jbarang = await Jbarang.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // jika barang tidak ditemukan
    if (!jbarang)
      return res.status(404).json({ msg: "Data Jasa Barang Tidak Ditemukan" });

    // req.role berasal dari middleware ketika login
    if (req.role === "admin") {
      // hapus gambar
      const filepath = `./public/images/jbarang/${jbarang.image}`;
      fs.unlinkSync(filepath);
      await Jbarang.destroy({
        where: {
          id: jbarang.id,
        },
      });
    } else {
      // jika user id dan barang user id tidak sama
      if (req.userId !== jbarang.userId)
        return res.status(403).json({ msg: "Akses Tidak ditemukan" });
      // jika kondisi terpenuhi
      // hapus gambar
      const filepath = `./public/images/jbarang/${jbarang.image}`;
      fs.unlinkSync(filepath);
      await Jbarang.destroy({
        where: {
          [Op.and]: [{ id: jbarang.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Jasa Barang Berhasil di Hapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
