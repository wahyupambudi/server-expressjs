import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json({
      status: true,
      message: "Data User",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({
      status: true,
      message: "Data User By UUID",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  // proses destruct
  const { name, email, password, password1, role } = req.body;

  //   validasi jika user sama
  const response = await User.findAll();

  // perulangan untuk cek apakah email ada yang sama
  for (let i = 0; i <= response.length; i++) {
    let dataEmail = response[i]?.email;
    if (dataEmail === email) {
      return res.status(400).json({ msg: "Registrasi Tidak Berhasil" });
    }
  }

  // validasi jika password kosong atau tidak sama
  if (password === "" || password === null) {
    return res.status(400).json({ msg: "Password Tidak Boleh Kosong" });
  } else if (password !== password1) {
    return res.status(400).json({ msg: "Password Tidak Cocok" });
  }
  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: "Registrasi Berhasil!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const { name, email, password, password1, role } = req.body;
  let hashPassword;
  if (password === "" || password === null) {
    // user dari variabel const user
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  //   validasi jika user sama
  const response = await User.findAll();

  // perulangan untuk cek apakah email ada yang sama
  for (let i = 0; i <= response.length; i++) {
    let dataEmail = response[i]?.email;
    if (dataEmail === email) {
      return res.status(400).json({ msg: "Update Tidak Berhasil" });
    }
  }
  if (password !== password1) {
    return res.status(400).json({ msg: "Password Tidak Cocok" });
  }

  try {
    await User.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          // user dari variabel const user
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User Berhasil Update!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  try {
    await User.destroy({
      where: {
        // user dari variabel const user
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Berhasil Di Hapus!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
