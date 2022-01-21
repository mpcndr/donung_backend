const mongoose = require("mongoose");
const { movie } = require("../worker");

mongoose.connect("mongodb://localhost:27017/disney_db", {
  useNewUrlParser: true,
});

const Like = mongoose.model("liked_table", {
  username: String,
  movie: [String],
});

exports.Register = async function (username) {
  try {
    const like_model = new Like({ username: username, movie: [] });
    let result = await like_model.save();
    return;
  } catch (error) {
    console.log("error " + error);
  }
};

exports.AddFav = async function (user, movie) {
  try {
    let fav = await Like.findOne({ username: user });

    let movie_list = fav.movie;

    movie_list.push(movie);

    let result = await Like.findOneAndUpdate(
      { username: user },
      {
        movie: movie_list,
      }
    );
    console.log(result);
    return {
      isSuccess: true,
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
    };
  }
};

exports.getFavoriteMovie = async function (user) {
  try {
    let movieFav = await Like.findOne({ username: user });
    return {
      isSuccess: true,
      fav_list: movieFav.movie,
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
    };
  }
};

exports.deleteMovieFav = async function (user, movie) {
  try {
    let fav = await Like.findOne({ username: user });
    /**
     * @type {Array}
     */
    let movie_list = fav.movie;
    let dummy = movie_list.filter((m) => m != movie);
    console.log(dummy);
    let result = await Like.findOneAndUpdate(
      {
        username: user,
      },
      {
        movie: dummy,
      }
    );
    console.log(result);
    return {
      isSuccess: true,
      movie_del: movie,
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
    };
  }
};
