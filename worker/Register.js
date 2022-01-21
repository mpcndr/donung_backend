const crypto = require("crypto");
const db_disney = require("../database/database_disney");
const db_mongo = require("../database/mongo_database");
const jwt = require("jsonwebtoken");
const envi = require("../envi");

exports.register = async function (username, password, email, tel) {
  let uuid = crypto.randomUUID().toString();
  let encryptPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");
  let result = await db_disney.register(
    uuid,
    username,
    encryptPassword,
    email,
    tel
  );
  let resultMongo = await db_mongo.Register(username);
  return result;
};

exports.CheckDuplicateUser = async function (username) {
  let result = await db_disney.CheckDuplicateUser(username);
  console.log("worker check here!");
  return result;
};

exports.login = async function (user, password) {
  console.log("here register worker");
  let encryptPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");
  let result = await db_disney.login(user, encryptPassword);
  //   console.log(result);
  if (result.data.length == 0 && result.data[0] == undefined) {
    return {
      isSuccess: false,
      msg: "not found",
    };
  }
  let user_movie = result.data[0].username;
  let exp = envi.EXPIRED;

  let token = jwt.sign(
    {
      username: user_movie,
    },
    envi.SECRET,
    {
      expiresIn: exp,
    }
  );
  console.log(token);

  return {
    isSuccess: true,
    user: user_movie,
    token: token,
    expired: exp,
  };
};

exports.Authorization = function (token) {
  return new Promise((res, rej) => {
    jwt.verify(token, envi.SECRET, (err, result) => {
      if (err) {
        res({
          isSuccess: false,
          message: err,
        });
      } else {
        res({
          isSuccess: true,
        });
      }
    });
  });
};
