const movieService = require('./movie.service')
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')

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
async function searchMovie(req, res) {
      try {
            const { searchedMovie } = req.params
            movies = await movieService.tmdb_searchMovie(searchedMovie)
            res.json(movies.results)
      } catch (err) {
            logger.error('Cannot get movies', err)
            res.status(500).send({ err: 'Failed to get movie' })
      }
}

// async function getImages(req, res) {
//       try {
//             const { id } = req.params
//             images = await movieService.tmdb_getImages(id)
//             res.json(images)
//       } catch (err) {
//             logger.error('Cannot get images', err)
//             res.status(500).send({ err: 'Failed to get images' })
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
      searchMovie,
      // getImages
      // getSimilarMovies
}