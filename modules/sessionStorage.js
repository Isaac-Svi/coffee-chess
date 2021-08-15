const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto-js')

class SessionStorage {
    constructor(attributes) {
        this.sessions = {}

        this.httpOnly = attributes.httpOnly ?? true
        this.cookieName = attributes.cookieName ?? 'sess-cookie'
        this.sessionSecret = attributes.sessionSecret
        this.path = attributes.path ?? '/'

        // sessions before cookie expires, default is 7 days
        this.maxAge = attributes.maxAge ?? 60 * 60 * 24 * 7
    }

    privateRoute() {
        return (req, res, next) => {
            if (!(req.user && req.user.id)) {
                return next(new Error('No session'))
            }
            next()
        }
    }

    publicRoute(redirectRoute) {
        return (req, res, next) => {
            if (req.user && req.user.id) {
                return res.redirect(redirectRoute)
            }
            next()
        }
    }

    getSession(sessionId) {
        return this.sessions[sessionId]
    }

    createSession(userInfo) {
        const sessionId = uuidv4()

        this.sessions[sessionId] = {
            ...userInfo,
            logout: () => this.removeSession(sessionId),
        }

        return crypto.AES.encrypt(sessionId, this.sessionSecret).toString()
    }

    parseSession() {
        return (req, res, next) => {
            this.req = req
            this.res = res
            this.next = next

            // default user
            req.user = {
                login: (redirectRoute, userInfo) =>
                    this.setupCredentials(redirectRoute, userInfo),
            }

            // make sure there are cookies
            if (!req.headers.cookie) return next()

            // make sure our session cookie is in the cookies
            const cookies = Object.fromEntries(
                req.headers.cookie.split(';').map((x) => x.split('='))
            )

            if (!cookies[this.cookieName]) return next()

            // if it is, it should have the sessionId. get session using sessionId
            const sessionId = crypto.AES.decrypt(
                decodeURIComponent(cookies[this.cookieName]),
                this.sessionSecret
            ).toString(crypto.enc.Utf8)

            // if there's no value in sessionId after decrypting, exit
            if (!sessionId) return next()

            // finally, everything checks out, put session info in req.user
            // + logout function
            req.user = this.getSession(sessionId)
            next()
        }
    }

    setupCredentials(redirectRoute, userInfo) {
        try {
            const sessionInfo = this.createSession(userInfo)

            this.res.cookie(this.cookieName, sessionInfo, {
                maxAge: this.maxAge,
                httpOnly: this.httpOnly,
            })

            this.res.redirect(redirectRoute)
        } catch (err) {
            console.log(err.message)
            this.next(err.message)
        }
    }

    removeSession(sessionId) {
        delete this.sessions[sessionId]

        this.res.cookie(this.cookieName, '', {
            maxAge: 1,
            httpOnly: this.httpOnly,
        })
    }
}

module.exports = SessionStorage
