const express = require('express')
const { log } = require('../../middlewares/logger.middleware')
const {
    getMovies,
    getMovieById,
    addMovie,
    deleteMovie,
    updateMovie,
    getCurrMovieBId,
    getMostPopularMovies,
    getMostUpcomingMovies,
    searchMovie,
    getActorDetail
} = require('./movie.controller')
const router = express.Router()

router.get('/getMovie/:id', log, getCurrMovieBId)
router.get('/getActor/:actorId', log, getActorDetail)
router.get('/getPopularMovies', log, getMostPopularMovies)
router.get('/getUpcomingMovies', log, getMostUpcomingMovies)
router.get('/searchMovie/:searchedMovie', log, searchMovie)
router.get('/', log, getMovies)
router.get('/:id', log, getMovieById)
router.post('/', log, addMovie)
router.delete('/:id', log, deleteMovie)
router.put('/:id', log, updateMovie)

module.exports = router