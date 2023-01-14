import Barang from "../models/BarangModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

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
    // jika user admin menampilkan berdasarkan id barang dari semua user
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
          "image",
          "url",
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
    }
    // jika user menampilkan berdasarkan id barang dari userid
    else {
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
          "image",
          "url",
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
  // mendapatkan data input dari form
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

  // check jika file kosong
  if (req.files === null)
    return res.status(400).json({ msg: "Tidak ada file yang di upload" });

  // membuat variabel untuk menampung data gambar
  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = Date.now() + "-" + file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/barang/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  // membuat kondisi jika variabel allowedType dan jika fileSize
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Gambar tidak sesuai" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Ukuran gambar harus dibawah 5MB" });

  // jika kondisi benar maka akan melakukan proses simpan data
  file.mv(`./public/images/barang/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
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

export const updateBarang = async (req, res) => {
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

  // kode untuk manajemen gambar
  let fileName;
  // check jika gambar null maka langsung update data selain image
  if (req.files === null) {
    fileName = barang.image;
    // console.log(fileName);
  }
  // jika gambar tidak kosong melakukan proses update gambar
  else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = Date.now() + "-" + file.md5 + ext;
    // console.log(fileName);

    const allowedType = [".png", ".jpg", ".jpeg"];

    // membuat kondisi jika variabel allowedType dan jika fileSize
    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Gambar tidak sesuai" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Ukuran gambar harus dibawah 5MB" });

    // hapus gambar
    const filepath = `./public/images/barang/${barang.image}`;
    fs.unlinkSync(filepath);

    // pindahkan gambar ke folder public
    file.mv(`./public/images/barang/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  // deklarasi variabel url diluar scope
  const url = `${req.protocol}://${req.get("host")}/images/barang/${fileName}`;

  try {
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
          image: fileName,
          url: url,
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
          image: fileName,
          url: url,
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
      // hapus gambar
      const filepath = `./public/images/barang/${barang.image}`;
      fs.unlinkSync(filepath);
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
      // hapus gambar
      const filepath = `./public/images/barang/${barang.image}`;
      fs.unlinkSync(filepath);
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
