
import express from "express"; 
import morgan from "morgan";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import planRouter from "./routers/planRouter";


//express application(server) 만들기
const app = express(); 
// middle ware 패키지 사용(dev)
const logger = morgan("dev");

//ejs 사용
app.set("view engine", "ejs");
//app.engine('html', require('ejs').renderFile); html 파일 사용 x 해서 지움
app.set("views", process.cwd() + "/src/views");
app.use(logger)
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/plans", planRouter);

export default app;

