require('dotenv').config()
const { PORT, SESSION_SECRET } = process.env

const express = require('express')
const http = require('http')

// session storage
const SessionStorage = require('./modules/sessionStorage')
const session = new SessionStorage({
    cookieName: 'coffee-chess',
    sessionSecret: SESSION_SECRET,
    maxAge: 900000, // 15 minutes
    httpOnly: true,
})

const app = express()
const server = http.createServer(app)

// socket server
require('./socketServer')(server)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session.parseSession())

app.use(express.static(__dirname + '/public'))

// http routes
const homeRoute = require('./routes/home.route')
const chessRoute = require('./routes/chess.route')
const loginRoute = require('./routes/login.route')
const registerRoute = require('./routes/register.route')
const gameRoute = require('./routes/game.route')

app.use('/', homeRoute)
app.use('/login', session.publicRoute('/'), loginRoute)
app.use('/register', session.publicRoute('/'), registerRoute)
app.use('/chess', session.privateRoute(), chessRoute)
app.use('/game', session.privateRoute(), gameRoute)
app.post('/logout', session.privateRoute(), (req, res) => {
    req.user.logout()
    res.redirect('/')
})

app.get('/user', session.privateRoute(), (req, res) => {
    res.send(req.user.username)
})

// handle 404's
app.get('*', (req, res) => {
    res.render('404', { user: req.user })
})

app.use((err, req, res, next) => {
    console.log(err.message)
    res.redirect('/')
})

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
