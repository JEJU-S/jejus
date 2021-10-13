import express from "express"; 
import morgan from "morgan";
import dotdev from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import planRouter from "./routers/planRouter";

import path from "path";

dotdev.config();


//express application(server) 만들기
const app = express(); 
// middle ware 패키지 사용(dev)
const logger = morgan("dev");

//ejs 사용
app.set("view engine", "ejs");
//app.engine('html', require('ejs').renderFile); html 파일 사용 x 해서 지움
app.set("views", process.cwd() + "/src/views");
app.use(logger)

app.use( 
    session({
        secret : process.env.COOKIE_SECRET,
        resave : false,
        saveUninitialized : true, // 추후 false로 바꿔야 함
        cookie : {
            //maxAge : 20000,
        }
        /*
        store : MongoStore.create({
            mongoUrl : process.env.DB_URL,
        })
        */
    })
);

//session 확인용  middleware
app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
        console.log(sessions);
        next();
    });
});

// public 폴더 접근 가능할 수 있게 해줌(css, js)
app.use("/public", express.static(path.join(__dirname, "public")));

// post 내용 받아옴

app.use(express.urlencoded({ extended: true }));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/plans", planRouter);

export default app;

