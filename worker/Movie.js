let db_disney = require("../database/database_disney");
let db_mongo = require("../database/mongo_database")

exports.getAll = async function () {
  let result = await db_disney.getAll();
  return result;
};

exports.getMovie = async function (movie_title) {
  let result = await db_disney.getMovie(movie_title);
  return result;
};

exports.addFavourite = async function(user, movie) {
  console.log('hereee')
  let result = await db_mongo.AddFav(user, movie);
  return result;
}

exports.getFavourite = async function(user) {
  let result = await db_mongo.getFavoriteMovie(user);
  return result;
}

exports.deleteMovieFav = async function (user, movie) {
  let result = await db_mongo.deleteMovieFav(user, movie);
  return result;
}


