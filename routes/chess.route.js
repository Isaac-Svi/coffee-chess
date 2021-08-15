const router = require('express').Router()

router.route('/').get((req, res) => res.render('chess', { user: req.user }))

module.exports = router
