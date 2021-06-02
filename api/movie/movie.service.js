const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const axios = require('axios');
const API_KEY = '78332b7b482be5c8b58eebf82ef1cbd4'

async function query() {
      try {
            const collection = await dbService.getCollection('movie')
            const movies = await collection.find().toArray()
            return movies
      } catch (err) {
            logger.error('cannot find movies', err)
            throw err
      }

}

async function getById(movieId) {
      try {
            const collection = await dbService.getCollection('movie')
            const movie = await collection.findOne({ '_id': ObjectId(movieId) })
            return movie
      } catch (err) {
            logger.error(`while finding movie ${movieId}`, err)
            throw err
      }
}

async function add(movie) {
      try {
            const collection = await dbService.getCollection('movie')
            await collection.insertOne(movie)
            return movie;
      } catch (err) {
            logger.error('cannot insert movie', err)
            throw err
      }
}

async function update(movie) {
      try {
            movie._id = ObjectId(movie._id)
            const collection = await dbService.getCollection('movie')
            await collection.updateOne({ '_id': movie._id }, { $set: movie })
            return movie;
      } catch (err) {
            logger.error(`cannot update movie ${movie._id}`, err)
            throw err
      }
}

async function remove(movieId) {
      try {
            const collection = await dbService.getCollection('movie')
            const query = { _id: ObjectId(movieId) }
            await collection.deleteOne(query)
      } catch (err) {
            logger.error(`cannot remove movie ${movieId}`, err)
            throw err
      }
}

function _getMovieImages(movie) {
      const movieImg = `https://image.tmdb.org/t/p/original/${movie.poster_path}`
      const backDropImg = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
      // delete movie.poster_path
      // delete movie.backdrop_path
      return { movieImg, backDropImg }
}

async function tmdb_getMovieBId(id) {
      try {
            const movie = await axios(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
            const { movieImg, backDropImg } = _getMovieImages(movie.data)
            movie.data.image = movieImg
            movie.data.backDrop = backDropImg
            movie.data.actors = await tmdb_getCast(id, "cast")
            movie.data.crew = await tmdb_getCast(id, "crew")
            movie.data.videos = await tmdb_getVideo(id)
            movie.data.similarMovies = await tmdb_getSimilarMovies(id)
            movie.data.similarMovies.forEach((similiarMovie => {
                  similiarMovie.image = `https://image.tmdb.org/t/p/original/${similiarMovie.poster_path}`

            }))
            movie.data.production_companies.map((company) => {
                  if (company.logo_path) company.logo_path = `https://image.tmdb.org/t/p/original/${company.logo_path}`
            })
            return movie.data
      } catch (err) {
            logger.error(`while finding movie ${id}`, err)
            throw err
      }
}

async function tmdb_getMostPopularMovies(page = 1) {
      try {
            console.log('test');

            const popularMovies = await axios(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`)
            // popularMovies.data.results.map( (movie) => {
            //       d}
            popularMovies.data.results.map( (movie) => {
                  // const movieBackdrop = tmdb_getImages(movie.id)
                  // console.log('movieBackdrop:', movieBackdrop)
                  const { movieImg, backDropImg } = _getMovieImages(movie)
                  movie.image = movieImg
                  movie.backDrop = backDropImg
                  // movie.backDrop = movieBackdrop
            })
            return popularMovies.data
      } catch (err) {
            logger.error(`while finding popular movies `, err)
            throw err
      }
}
async function tmdb_getMostUpcomingMovies(page = 1) {
      try {
            const popularMovies = await axios(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`)
            popularMovies.data.results.map((movie) => {
                  const { movieImg } = _getMovieImages(movie)
                  movie.image = movieImg
            })
            return popularMovies.data
      } catch (err) {
            logger.error(`while finding popular movies `, err)
            throw err
      }
}

async function tmdb_getCast(movieId, type) {
      try {
            const actors = await axios(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`)
            actors.data.cast.map((actor) => {
                  actor.image = `https://image.tmdb.org/t/p/original/${actor.profile_path} `
            })
            return actors.data[type]
      } catch (err) {
            throw err
      }
}

async function tmdb_getVideo(movieId) {
      try {
            const videos = await axios(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`)
            return videos.data.results
      } catch (err) {
            throw err
      }
}

async function tmdb_getSimilarMovies(movieId, page = 1) {
      try {
            const movies = await axios(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=${page}`)
            return movies.data.results
      } catch (err) {
            throw err
      }
}

async function tmdb_searchMovie(searchedMovie, page = 1) {
      try {
            const movies = await axios(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=${page}&include_adult=false&query=${searchedMovie}`)
            movies.data.results.map((movie) => {
            const { movieImg } = _getMovieImages(movie)
            movie.image = movieImg
            })
            return movies.data
      } catch (err) {
            console.log('err:', err)
            throw err
      }
}

// async function tmdb_getImages(movieId) {
//       try {
//             const images = await axios(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${API_KEY}`)
//             // console.log('images:', images.data)
//             return images.data
//       } catch (err) {
//             throw err
//       }
// }



module.exports = {
      query,
      getById,
      add,
      update,
      remove,
      tmdb_getMovieBId,
      tmdb_getMostPopularMovies,
      tmdb_getMostUpcomingMovies,
      tmdb_searchMovie,
      // tmdb_getImages
}


