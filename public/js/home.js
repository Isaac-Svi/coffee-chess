const socket = io('/')

socket.on('connect', () => {
    socket.send('connected')
})

socket.on('message', (data) => {
    console.log(data)
})

socket.on('game joined', async (game) => {
    console.log(game)
})

socket.on('game begin', (game) => {
    console.log('howdy')
    console.log(game)
})

socket.on('game created', (details) => {
    const { user, game_id, player_white, player_black, minutes, seconds } = details
    console.log(details)

    const _ = document.createElement

    const game = _('div'),
        ply = _('span'),
        sd = _('span'),
        time = _('span')

    ply.innerText = player
    sd.innerText = side
    time.innerText = `${minutes}:${seconds}`

    game.append(ply)
    game.append(sd)
    game.append(time)

    game.addEventListener('click', () => (window.location.href = gameURL))
})

const closeModal = () => {
    document.querySelector('.modal').classList.remove('active')
}

const openModal = () => {
    document.querySelector('.modal').classList.add('active')
}

const createGame = async (e) => {
    e.preventDefault()

    const { side, minutes, seconds } = e.target
    try {
        const res = await fetch('/user')
        const username = await res.text()

        socket.emit('game created', {
            player: username,
            side: side.value,
            minutes: minutes.value,
            seconds: seconds.value,
        })

        window.location.reload()
    } catch (err) {
        console.log(err.message)
    }
}
