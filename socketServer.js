const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const conn = require('./db/conn')
const currentGamesPath = path.resolve('current_games.json')
const { Server } = require('socket.io')

const socketSessions = {}
let globalSocket, globalIo

const socketServer = (server) => {
    const io = new Server(server)
    globalIo = io

    globalIo.on('connection', (socket) => {
        globalSocket = socket

        socket.send('hello')
        socket.on('message', (data) => console.log(data))

        socket.on('game created', (details) => createGame(socket, details))
    })
}

const myModule = (module.exports = (server) => socketServer(server))
myModule.getSocketSessions = () => socketSessions
myModule.setSocketSession = (userId, socketId) => (socketSessions[userId] = socketId)
myModule.getSocket = () => globalSocket
myModule.getIo = () => globalIo

async function createGame(socket, details) {
    let { player, side, minutes, seconds } = details

    const [{ user_id, username }] = await conn('users')
        .select('user_id', 'username')
        .where({ username: player })

    const newGame = {
        id: uuidv4(),
        challenger: player,
        minutes,
        seconds,
        challenger_id: user_id,
        user: username,
        challenger_side:
            side === 'random' ? (Math.random() > 0.5 ? 'white' : 'black') : side,
    }

    const games = JSON.parse(fs.readFileSync(currentGamesPath).toString())
    games.push(newGame)
    fs.writeFileSync(currentGamesPath, JSON.stringify(games, null, 2))

    // socket.join(newGame.id)
    socket.emit('game created', newGame)
}
