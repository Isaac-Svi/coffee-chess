const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const openGamesPath = path.resolve('current_games.json')
const {
    getSocket,
    setSocketSession,
    getSocketSessions,
    getIo,
} = require('../socketServer')

router.route('/').get((req, res) => {
    // this makes sure if user refreshes, socket connection will be up to date
    if (req.user && req.user.id) {
        const socket = getSocket()
        // adds socket connection if it isn't there, and updates socket id
        // if it is there
        setSocketSession(req.user.id, socket.id)
        console.log(getSocketSessions())
        console.log(getIo())
    }

    try {
        const games = JSON.parse(fs.readFileSync(openGamesPath).toString())

        res.render('home', {
            games,
            user: req.user.id ? req.user : '',
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
