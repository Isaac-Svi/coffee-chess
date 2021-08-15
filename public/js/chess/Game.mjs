import { createElement, appendMany } from '../utils.mjs'
import { Square } from './Square.mjs'
import { Pawn, Bishop, Rook, Knight, Queen, King, Piece } from './pieces/index.mjs'

export class Game {
    constructor(playerLight, playerDark) {
        this.playerLight = playerLight
        this.playerDark = playerDark
        this.squares = []

        this._setupBoard()
        this._setupLightPieces()
        this._setupDarkPieces()

        window.addEventListener('click', this._clearHighlights.bind(this))
    }

    _clearHighlights(e) {
        if (e.target.classList.contains('piece')) return

        document.querySelectorAll('.highlighted').forEach((el) => {
            el.classList.remove('highlighted')
        })
    }

    _setupBoard() {
        this.$board = createElement({ classes: 'board' })

        // setup squares
        for (let x = 0; x < 8; x++) {
            const row = createElement({ classes: 'row' })

            const rowSquares = []
            for (let i = 0; i < 8; i++) {
                const s = new Square(row)
                // s.$el.innerText = s.number
                rowSquares.push(s.$el)
            }

            this.squares.push(...rowSquares)
            appendMany(row, rowSquares)
            this.$board.append(row)
        }

        document.body.append(this.$board)
    }

    _createPiece(piece, square, color) {
        const classes = `piece fas fa-chess-${piece} ${color}`
        const tag = 'i'
        const params = [square, createElement({ tag, classes }), color]

        return new {
            pawn: Pawn,
            bishop: Bishop,
            rook: Rook,
            knight: Knight,
            queen: Queen,
            king: King,
        }[piece](...params)
    }

    _setupLightPieces() {
        // setup pawns
        for (let i = 0; i < 8; i++) {
            // light pawns start from 8
            const pawn = this._createPiece('pawn', i + 8, 'light')
            Piece.pieces.light.push(pawn)
        }

        // setup bishops
        const b1 = this._createPiece('bishop', 5, 'light')
        const b2 = this._createPiece('bishop', 2, 'light')
        Piece.pieces.light.push(b1, b2)

        // setup rooks
        const r1 = this._createPiece('rook', 7, 'light')
        const r2 = this._createPiece('rook', 0, 'light')
        Piece.pieces.light.push(r1, r2)

        // setup knights
        const kn1 = this._createPiece('knight', 6, 'light')
        const kn2 = this._createPiece('knight', 1, 'light')
        Piece.pieces.light.push(kn1, kn2)

        // setup queen
        const q = this._createPiece('queen', 4, 'light')
        Piece.pieces.light.push(q)

        // setup king
        const k = this._createPiece('king', 3, 'light')
        Piece.pieces.light.push(k)
    }

    _setupDarkPieces() {
        // setup pawns
        for (let i = 0; i < 8; i++) {
            // dark pawns start from 48
            const pawn = this._createPiece('pawn', i + 48, 'dark')
            Piece.pieces.dark.push(pawn)
        }

        // setup bishops
        const b1 = this._createPiece('bishop', 61, 'dark')
        const b2 = this._createPiece('bishop', 58, 'dark')
        Piece.pieces.dark.push(b1, b2)

        // setup rooks
        const r1 = this._createPiece('rook', 63, 'dark')
        const r2 = this._createPiece('rook', 56, 'dark')
        Piece.pieces.dark.push(r1, r2)

        // setup knights
        const kn1 = this._createPiece('knight', 62, 'dark')
        const kn2 = this._createPiece('knight', 57, 'dark')
        Piece.pieces.dark.push(kn1, kn2)

        // setup queen
        const q = this._createPiece('queen', 60, 'dark')
        Piece.pieces.dark.push(q)

        // setup king
        const k = this._createPiece('king', 59, 'dark')
        Piece.pieces.dark.push(k)
    }
}
