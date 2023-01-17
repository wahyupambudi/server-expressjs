import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // jika tidak mendapattoken
    if (!refreshToken) return res.sendStatus(401);

    // jika mendapat token
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    // jika tidak cocok
    if (!user) return res.sendStatus(403);

    // jika token cocok
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        // jika error
        if (err) return res.sendStatus(403);
        // jika tidak error ambil data dari id
        const uuid = user[0].uuid;
        const name = user[0].name;
        const email = user[0].email;
        const role = user[0].role;

        // membuat akses token baru
        const accessToken = jwt.sign(
          { uuid, name, email, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "20m",
          }
        );
        // tampilkan accessToken
        res.json({ accessToken });
      }
    );
  } catch (error) {
    // console.log(error);
    res.status(403).json({ error: error, msg: "Access Token tidak ada" });
  }
};
