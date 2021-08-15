const router = require('express').Router()
const conn = require('../db/conn')
const p4ssw0rd = require('p4ssw0rd')

router
    .route('/')
    .get((_, res) => res.render('login', { user: '' }))
    .post(async (req, res) => {
        if (req.user && req.user.id) {
            return res.redirect('/')
        }

        try {
            const { username, password } = req.body

            const [user] = await conn('users').select('*').where({ username })

            if (!user) {
                return res.redirect(`/login?error="User doesn't exist"`)
            }

            if (!p4ssw0rd.check(password, user.password)) {
                return res.redirect(`/login?error=Invalid credentials`)
            }

            req.user.login('/', {
                id: user.user_id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            })
        } catch (err) {
            res.status(400).send({ error: err.message })
        }
    })

module.exports = router
