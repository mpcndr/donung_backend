const worker = require('./index')

exports.userAuthorization = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token == undefined) {
    return res.send({
      isSuccess: false,
      msg: "ไม่มีการเข้าสู่ระบบ",
    });
  }
  let isValid = await worker.regis.Authorization(token);
  if (isValid.isSuccess == false) {
    if (isValid.isSuccess == "TokenExpiredError: jwt expired") {
      return res.send({
        isSuccess: false,
        msg: "Session หมดอายุ",
      });
    }
    if (isValid.msg == "JsonWebTokenError: jwt must be provided") {
      return res.send({
        isSuccess: false,
        msg: "เกิดข้อผิดพลาด authen ต้องไม่เป็นค่าว่าง",
      });
    }
    if (isValid.msg == "JsonWebTokenError: jwt malformed") {
      return res.send({
        isSuccess: false,
        msg: "เกิดข้อผิดพลาด token ไม่ถูกต้อง",
      });
    }
    return res.send({
      isSuccess: false,
      msg: "เกิดข้อผิดพลาด " + isValid.msg,
    });
  } else {
    next();
  }
};

exports.adminAuthorization = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token == undefined) {
      return res.send({
        isSuccess: false,
        msg: "ไม่มีการเข้าสู่ระบบ",
      });
    }
    let isValid = await worker.admin.Authorization(token);
    if (isValid.isSuccess == false) {
      if (isValid.isSuccess == "TokenExpiredError: jwt expired") {
        return res.send({
          isSuccess: false,
          msg: "Session หมดอายุ",
        });
      }
      if (isValid.msg == "JsonWebTokenError: jwt must be provided") {
        return res.send({
          isSuccess: false,
          msg: "เกิดข้อผิดพลาด authen ต้องไม่เป็นค่าว่าง",
        });
      }
      if (isValid.msg == "JsonWebTokenError: jwt malformed") {
        return res.send({
          isSuccess: false,
          msg: "เกิดข้อผิดพลาด token ไม่ถูกต้อง",
        });
      }
      return res.send({
        isSuccess: false,
        msg: "เกิดข้อผิดพลาด " + isValid.msg,
      });
    } else {
      next();
    }
  };
