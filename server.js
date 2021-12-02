require("dotenv").config();
const express = require("express");
const server = express();
const connectDB = require("./database");
const cors = require("cors");
const routes = require("./routes");
// const exphbs = require("express-handlebars");
// const passport = require("passport");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const methodOverride = require("method-override");

connectDB();

// server.engine('hbs', require('exphbs'));
// server.set('view engine', 'hbs');

// require("./passport")(passport);

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cors());
// server.use(
//   methodOverride(function (req, res) {
//     if (req.body && typeof req.body === "object" && "_method" in req.body) {
//       let method = req.body._method;
//       delete req.body._method;
//       return method;
//     }
//   })
// );

// server.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: "mongodb+srv://cps530:pass530@jobs.sc8vt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
//     }),
//   })
// );

// server.use(passport.initialize());
// server.use(passport.session());

server.use("/", routes);

const PORT = 5000;
server.listen(process.env.PORT || PORT, console.log("Server Running"));
