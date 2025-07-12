// triple-slash directive nạp thủ công file type
 ///<reference path="./types/type.d.ts" />   
import express from "express"//import express
import { webRoutes } from "./routes/web";
import { db } from "./config/db";
import 'dotenv/config'
import { initDataBase } from "./config/seed";
import passport from "passport";
import { prisma } from "./config/client";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import "./middleware/passport.local" // đăng kí strategy  passport
import apiRoutes from "./routes/api";
import cors from "cors";

const app = express() // tạo express application
const PORT = process.env.PORT || 8080// init port

// template engine
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views'); // Thư mục chứa file .ejs

// Middleware để parse JSON body
app.use(express.json()); // sử dụng với req.body
app.use(express.urlencoded({ extended: true })); //  v form HTML gửi dạng application/x-www-form-urlencoded

// config static files
app.use(express.static('public'))

// config express-session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    // ✅ cookie là phần hợp lệ
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  })
);

// config passport
app.use(passport.initialize());
app.use(passport.session()); // gọi middleware

//Res.locals
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});;
// cors
app.use(cors({
  origin:'http://localhost:5173'
}))
//Import routes + DB + seed:
// //config routes
webRoutes(app)
//config api
apiRoutes(app)
// config database
db()

// seedDataBase
initDataBase()
// app.js hoặc server.js
app.use((req, res, next) => {
  res.status(403).render('status/403'); // Không dùng dấu /
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

