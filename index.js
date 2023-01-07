import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import SequelizeStore from "connect-session-sequelize";
// import dari routes
import UserRoute from "./routes/UserRoute.js";
import BarangRoute from "./routes/BarangRoute.js";
import JbarangRoute from "./routes/JbarangRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

// import config database
import db from "./config/database.js";
// gunakan untuk create table
// (async () => {
//   await db.sync();
// })();

// memanggil fungsi dotenv
dotenv.config();

// import db from "./config/Database.js";
// import SequelizeStore from "connect-session-sequelize";
// import UserRoute from "./routes/UserRoute.js";
// import ProductRoute from "./routes/ProductRoute.js";
// import AuthRoute from "./routes/AuthRoute.js";

const app = express();

// digunakan untuk sessions
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
  checkExpirationInterval: 43200000, // interval hapus dari database setiap 12 jam
  expiration: 900000, // waktu session 15 menit
});

// membuat table session di database
// store.sync();

// definisikan session
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      // auto jika menggunakan http/s
      secure: "auto",
      maxAge: 900000,
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(BarangRoute);
app.use(JbarangRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
