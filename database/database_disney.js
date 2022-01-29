var mysql = require("mysql");
const { getAll, movie } = require("../worker");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mp100442",
  database: "disney_movie",
});

const query = function (qur) {
  return new Promise((res, rej) => {
    connection.query(qur, function (error, results, fields) {
      if (error) {
        rej(error);
      }
      res(results);
      //   return movie disney;
    });
  });
};

exports.getAll = async function () {
  let disney = "SELECT * FROM disney_movie.movie;";
  let res_movie = await query(disney);

  let response = {
    count: res_movie.length,
    res_movie,
  };
  // console.log(response.data.movie[0].movie_title);
  return response;
};

exports.getMovie = async function (movie_title) {
  try {
    let disneyQuery = `select * from disney_movie.movie where movie_title = ('${movie_title}');`;

    let disney = await query(disneyQuery);

    return {
      isSuccess: true,
      movie: disney,
    };
  } catch (error) {
    return {
      isSuccess: false,
      msg: error,
    };
  }
};

exports.register = async function (id, username, password, email, tel) {
  try {
    let regisQuery = `INSERT INTO user_movie (id_user, username, password, email, tel) VALUES ('${id}', '${username}', '${password}', '${email}', '${tel}');`;
    let regis = await query(regisQuery);

    return {
      isSuccess: true,
    };
  } catch (error) {
    if (error.errno == 1062) {
      return {
        isSuccess: false,
        msg: "ชื่อผู้ใช้ซ้ำ",
      };
    }
    console.log(error);
    return {
      isSuccess: false,
      msg: error,
    };
  }
};

exports.CheckDuplicateUser = async function (username) {
  try {
    // console.log("db check here!");
    let Query = `select * from disney_movie.user_movie where username = ('${username}');`;
    let check = await query(Query);

    console.log(check);

    //if (check ความยาว == 0 ) ; ไม่มีชื่อผู้ใช้นี้

    if (check.length == 0) {
      return {
        isSuccess: true,
      };
    } else {
      return {
        isSuccess: false,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      msg: error,
    };
  }
};

exports.login = async function (user, password) {
  try {
    let Query = `select * from user_movie where username = '${user}' and password = '${password}'`;
    let login_query = await query(Query);
    console.log("here login db");

    console.log(login_query);

    return {
      isSuccess: true,
      data: login_query,
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      msg: error,
    };
  }
};

exports.login_admin = async function (email, password) {
  try {
    let Query = `select * from admin where email = '${email}' and password = '${password}'`;
    let login_query = await query(Query);
    console.log("here login admin db");

    console.log(login_query);

    return {
      isSuccess: true,
      data: login_query,
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      msg: error,
    };
  }
};

exports.allAdmin = async () => {
  let Query = "SELECT * FROM disney_movie.admin;";
  let admin = await query(Query);

  let response = {
    count: admin.length,
    admin,
  };
  // console.log(response.data.movie[0].movie_title);
  return response;
};

exports.deleteAdmin = async (id) => {
  let Query = `DELETE FROM admin WHERE (id_admin = '${id}');`;
  let admin = await query(Query);

  let response = {
    isSuccess: true,
  };
  return response;
};

exports.addAdmin = async (email, user, password) => {
  let Query = `insert into admin (email, password, admin_name) values('${email}', '${password}', '${user}')`;
  let admin = await query(Query);

  let response = {
    isSuccess: true,
  };
  return response;
};
