const crypto = require("crypto");
const db_disney = require("../database/database_disney");
const jwt = require("jsonwebtoken");
const envi = require("../envi");

exports.allAdmin = async () => {
  let result = await db_disney.allAdmin();
  return result;
};

exports.login = async function (email, password) {
  try {
    console.log("here login admin worker");
    let encryptPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("base64");
    console.log(encryptPassword);
    let result = await db_disney.login_admin(email, encryptPassword);
    console.log(result);
    if (result.data.length == 0 || result.data[0] == undefined) {
      return {
        isSuccess: false,
        msg: "not found",
      };
    }
    let adminName = result.data[0].admin_name;
    console.log(adminName);
    let exp = envi.EXPIRED;

    let token = jwt.sign(
      {
        username: adminName,
      },
      envi.SECRET,
      {
        expiresIn: exp,
      }
    );
    console.log("token--");
    console.log(token);
    return {
      isSuccess: true,
      user: adminName,
      token: token,
      expired: exp,
    };
  } catch (error) {
    console.log(error);
  }
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
