import { Piece } from './Piece.mjs'
import { _ } from '../../utils.mjs'

export class King extends Piece {
    constructor(square, $el, color) {
        super(square, $el, color)

        this.type = 'king'
        this.calculateLegalMoves()
    }

    diagonals = {
        NW: 9,
        NE: 7,
        SW: -7,
        SE: -9,
    }

    lines = {
        N: 8,
        S: -8,
        E: -1,
        W: 1,
    }

    _checkIllegalSquare(line, square) {
        if (line === 'W' && square % 8 === 7) return true
        if (line === 'E' && square % 8 === 0) return true
        if (line === 'N' && square > 55) return true
        if (line === 'S' && square < 8) return true

        return false
    }

    _calculateLine(line) {
        const inc = this.lines[line]
        let squareId = this.square + inc,
            sq = _(squareId)

        if (this._checkIllegalSquare(line, this.square)) return

        if (sq.children.length) {
            if (sq.children[0].classList.contains(this.opposingColor)) {
                this.legalMoves.push(squareId)
                return
            }
            return
        }

        this.legalMoves.push(squareId)
    }

    _calculateDiagonal(diagonal) {
        if (['NE', 'SE'].includes(diagonal) && this.square % 8 === 0) return
        if (['NW', 'SW'].includes(diagonal) && this.square % 8 === 7) return

        const inc = this.diagonals[diagonal]
        let squareId = this.square + inc,
            sq = _(squareId)

        if (!sq) return
        if (sq.children.length) {
            if (sq.children[0].classList.contains(this.opposingColor)) {
                this.legalMoves.push(squareId)
                return
            }
            return
        }

        this.legalMoves.push(squareId)
    }

    _calculateCheckMate() {
        // make sure this function is called after calculating all
        // of the king's legal moves
        // returns true if the king has nowhere to go and is checkmated
        const enemyMoves = new Set(
            Piece.pieces[this.opposingColor].flatMap((x) => x.legalMoves)
        )

        for (const move of enemyMoves) {
            if (this.legalMoves.includes(move)) {
                const index = this.legalMoves.indexOf(move)
                this.legalMoves.splice(index, 1)
            }
        }

        if (this.legalMoves.length > 0) return false
        return true
    }

    calculateLegalMoves() {
        this.legalMoves = []
        // if (this._isColorTurn()) return

        this._calculateLine('N')
        this._calculateLine('S')
        this._calculateLine('E')
        this._calculateLine('W')

        this._calculateDiagonal('NW')
        this._calculateDiagonal('NE')
        this._calculateDiagonal('SW')
        this._calculateDiagonal('SE')

        this._calculateCheckMate()
    }
}
