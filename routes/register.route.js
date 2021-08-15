const router = require('express').Router()
const conn = require('../db/conn')
const p4ssw0rd = require('p4ssw0rd')

router
    .route('/')
    .get((_, res) => res.render('register', { user: '' }))
    .post(async (req, res) => {
        if (req.user && req.user.id) {
            return res.redirect('/')
        }

        try {
            const { fname, lname, email, username, password } = req.body

            const [user] = await conn('users')
                .insert({
                    first_name: fname,
                    last_name: lname,
                    email,
                    username,
                    password: p4ssw0rd.hash(password, 10),
                })
                .returning(['user_id', 'first_name', 'last_name', 'username', 'email'])

            req.user.login('/', {
                id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
            })
        } catch (err) {
            console.log(err)
            res.status(404).redirect('/register?error=Invalid credentials')
        }
    })

module.exports = router
