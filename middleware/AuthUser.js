import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun anda!" });
  }
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  //   jika user ditemukan
  req.userId = user.id;
  req.role = user.role;
  next();
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    req.email = decoded.email;
    next();
  });
};

export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  //   jika user bukan admin
  if (user.role !== "admin")
    return res.status(403).json({ msg: "Akses Tidak Di izinkan" });
  next();
};

export const ketuaJurusan = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak ditemukan" });
  // jika user adalah ketuaJurusan
  if (user.role === "ketuajurusan")
    return res.status(403).json({ msg: "Akses Tidak Di izinkan" });
  next();
};
