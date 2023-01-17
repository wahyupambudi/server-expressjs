import Users from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// function login
export const login = async (req, res) => {
  // mencari data user berdasarkan email
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  //   jika user ditemukan
  const match = await argon2.verify(user.password, req.body.password);

  //   jika password tidaak betul
  if (!match) return res.status(400).json({ msg: "Password Salah" });

  //   jika password cocok
  req.session.userId = user.uuid;
  //   get data user
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;

  // jsonwebtoken
  const accessToken = jwt.sign(
    { uuid, name, email, role },
    // proses env dari file .env
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "20m",
    }
  );
  // membuat variabel refreshToken dari data .env
  const refreshToken = jwt.sign(
    { uuid, name, email, role },
    // proses env dari file .env
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  // update refresh token ke database
  await Users.update(
    { refresh_token: refreshToken },
    {
      where: {
        uuid: req.session.userId,
      },
    }
  );

  // membuat http only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: true,
    message: "Berhasil Login",
    dataUser: { uuid, name, email, role, accessToken },
  });
};

// function session
export const sessi = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun anda!" });
  }
  // mencari user berdasarkan uuid / userId
  const user = await Users.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json({ user });
};

// function logout
export const logout = async (req, res) => {
  // inisialisasi refreshToken dari cookies
  const refreshToken = req.cookies.refreshToken;
  // jika refreshToken false
  if (!refreshToken) return res.sendStatus(204);

  // jika benar, mencari user berdasarkan refresh token yang sama
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  // jika user tidak ditemukan
  if (!user[0]) return res.sendStatus(204);

  // jika user ditemukan
  const userId = user[0].id;
  // update refresh_token menjadi null
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  // prosess destroy session di tb sessions
  req.session.destroy((err) => {
    // jika gagal logout
    if (err) return res.status(400).json({ msg: "Tidak dapat Logout" });
    // jika berhasil logout
    res.status(200).json({ msg: "Berhasil Logout" });
  });
};
