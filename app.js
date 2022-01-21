const express = require("express");
const disney = express();
const envi = require("./envi");
const worker = require("./worker/index");

disney.use(express.static("src"));

disney.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

disney.use(express.urlencoded());
disney.use(express.json());

let adminMiddleWare = worker.authen.adminAuthorization;
let userMiddleWare = worker.authen.userAuthorization;

disney.get("/getAll", async (req, res) => {
  let movie = await worker.movie.getAll();
  console.log("Success All Movie");
  res.send(movie);
});

disney.get("/checkuser", async (req, res) => {
  console.log("check user!");
  let checkuser = req.query.username;
  if (checkuser != undefined && checkuser != "") {
    let check = await worker.regis.CheckDuplicateUser(checkuser);
    res.send(check);
  } else {
    res.send({
      isSuccess: false,
    });
  }
});

disney.get("/movie/:movie_title", async (req, res) => {
  let movie_title = req.params.movie_title;
  let movie = await worker.movie.getMovie(movie_title);
  console.log("Success getMovie");
  res.send(movie);
});

disney.post("/register", async (req, res) => {
  let user = req.body.username;
  let psw = req.body.password;
  let mail = req.body.email;
  let tel = req.body.tel;
  let result = await worker.regis.register(user, psw, mail, tel);
  res.send(result);
});

disney.post("/login", async (req, res) => {
  let user = req.body.username;
  let psw = req.body.password;
  let result = await worker.regis.login(user, psw);
  // console.log(result);
  console.log("here login app");
  res.send(result);
});

disney.post("/admin", async (req, res) => {
  let email = req.body.email;
  let psw = req.body.password;
  let result = await worker.admin.login(email, psw);
  // console.log(result);
  console.log("here login addmin");
  res.send(result);
});

disney.get("/allAdmin", adminMiddleWare, async (req, res) => {
  let user = await worker.admin.allAdmin();
  console.log("get all admin");
  res.send(user);
});

disney.post("/favmovie", userMiddleWare, async (req, res) => {
  let user = req.body.user;
  let movie = req.body.movie;

  let result = await worker.movie.addFavourite(user, movie);
  console.log("fav movie");
  res.send(result);
});

disney.get("/getfavourite", userMiddleWare, async (req, res) => {
  let user = req.query.user;
  let result = await worker.movie.getFavourite(user);
  res.send(result);
});

disney.post("/deleteMovieFav", userMiddleWare, async (req, res) => {
  let user = req.body.user;
  let movie = req.body.movie;

  let result = await worker.movie.deleteMovieFav(user, movie);
  res.send(result);
});

disney.listen(envi.PORT, () => {
  console.log("--- start ---");
});
