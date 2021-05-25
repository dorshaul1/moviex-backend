// const socketService = require('../../services/socket.service')
const movieService = require('./movie.service')
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')
// const userService = require('../user/user.service')

async function getMovies(req, res) {
      try {
            const movies = await movieService.query(req.query)
            res.send(movies)
      } catch (err) {
            logger.error('Cannot get movies', err)
            res.status(500).send({ err: 'Failed to get movies' })
      }
}

async function getMovieById(req, res) {
      try {
            const { id } = req.params
            movie = await movieService.getById(id)
            res.json(movie)
      } catch (err) {
            logger.error('Cannot get movie', err)
            res.status(500).send({ err: 'Failed to get movie' })
      }
}

async function addMovie(req, res) {
      try {
            var movie = req.body
            movie = await movieService.add(movie)
            res.send(movie)

      } catch (err) {
            console.log(err)
            logger.error('Failed to add movie', err)
            res.status(500).send({ err: 'Failed to add movie' })
      }
}

async function updateMovie(req, res) {
      try {
            const movie = req.body
            const updatedMovie = await movieService.update(movie)
            console.log('updatedMovie')
            socketService.broadcast({ type: 'movie-update', data: updatedMovie, room: updatedMovie._id })
            res.json(updatedMovie)
      } catch (err) {
            logger.error('Cannot update movie', err)
            res.status(500).send({ err: 'Failed to update movie' })
      }
}

async function deleteMovie(req, res) {
      try {
            await movieService.remove(req.params.id)
            res.send({ msg: 'Deleted successfully' })
      } catch (err) {
            logger.error('Failed to delete movie', err)
            res.status(500).send({ err: 'Failed to delete movie' })
      }
}

async function getCurrMovieBId(req, res) {
      try {
            const { id } = req.params
            movie = await movieService.tmdb_getMovieBId(id)
            res.json(movie)
      } catch (err) {
            logger.error('Cannot get movie', err)
            res.status(500).send({ err: 'Failed to get movie' })
      }
}

async function getMostPopularMovies(req, res) {
      try {
            movies = await movieService.tmdb_getMostPopularMovies()
            res.json(movies.results)
      } catch (err) {
            logger.error('Cannot get movies', err)
            res.status(500).send({ err: 'Failed to get movie' })
      }
}

async function getMostUpcomingMovies(req, res) {
      try {
            movies = await movieService.tmdb_getMostUpcomingMovies()
            res.json(movies.results)
      } catch (err) {
            logger.error('Cannot get movies', err)
            res.status(500).send({ err: 'Failed to get movie' })
      }
}
// async function getSimilarMovies(req, res) {
//       try {
//             const { id } = req.params
//             movies = await movieService.tmdb_getSimilarMovies(id)
//             res.json(movies.results)
//       } catch (err) {
//             logger.error('Cannot get movies', err)
//             res.status(500).send({ err: 'Failed to get movie' })
//       }
// }

module.exports = {
      getMovies,
      getMovieById,
      addMovie,
      updateMovie,
      deleteMovie,
      getCurrMovieBId,
      getMostPopularMovies,
      getMostUpcomingMovies,
      // getSimilarMovies
}