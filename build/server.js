"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _rootRouter = _interopRequireDefault(require("./routers/rootRouter"));

var _userRouter = _interopRequireDefault(require("./routers/userRouter"));

var _planRouter = _interopRequireDefault(require("./routers/planRouter"));

var _path = _interopRequireDefault(require("path"));

_dotenv["default"].config(); //express application(server) 만들기


var app = (0, _express["default"])(); // middle ware 패키지 사용(dev)

var logger = (0, _morgan["default"])("dev"); //ejs 사용

app.set("view engine", "ejs"); //app.engine('html', require('ejs').renderFile); html 파일 사용 x 해서 지움

app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use((0, _expressSession["default"])({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  // 추후 false로 바꿔야 함
  cookie: {//maxAge : 20000,
  }
  /*
  store : MongoStore.create({
      mongoUrl : process.env.DB_URL,
  })
  */

})); //session 확인용  middleware

app.use(function (req, res, next) {
  req.sessionStore.all(function (error, sessions) {
    console.log(sessions);
    next();
  });
}); // public 폴더 접근 가능할 수 있게 해줌(css, js)
//app.use("/public", express.static(path.join(__dirname, "public")));

var srcPath = _path["default"].resolve(__dirname + "/.././src/public");

app.use("/public", _express["default"]["static"](srcPath)); // post 내용 받아옴

app.use(_express["default"].urlencoded({
  extended: true
}));
app.use("/", _rootRouter["default"]);
app.use("/users", _userRouter["default"]);
app.use("/plans", _planRouter["default"]);
var _default = app;
exports["default"] = _default;