const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const openGamePath = path.resolve('current_games.json')
const conn = require('../db/conn')
const { getIo, getSocketSessions } = require('../socketServer')

router.route('/:id').get(async (req, res) => {
    const { id } = req.params

    try {
        const games = JSON.parse(fs.readFileSync(openGamePath).toString())

        const {
            id: url,
            challenger_id,
            challenger,
            challenger_side,
            minutes,
            seconds,
        } = games.find((x) => x.id === id)

        if (challenger === req.user.username) return res.redirect('/')

        const newGame = {
            url,
            minutes,
            seconds,
        }

        if (challenger_side === 'white') {
            newGame.player_white = challenger
            newGame.player_black = req.user.username
        } else if (challenger_side === 'black') {
            newGame.player_black = challenger
            newGame.player_white = req.user.username
        }

        const insertedGame = await conn('games').insert(newGame).returning('*')

        const sockets = getSocketSessions()
        const challengerSocket = sockets[challenger_id + '']
        const io = getIo()

        const ids = []
        for (const socket of io.sockets.sockets) {
            ids.push(socket.id)
        }

        // io.sockets.sockets.get(challengerSocket).join(url)
        // io.to(url).emit('game begin', insertedGame)
        io.to(challengerSocket).emit('game begin', insertedGame)

        res.redirect('/chess')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
