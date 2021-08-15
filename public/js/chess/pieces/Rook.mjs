import { Piece } from './Piece.mjs'
import { _ } from '../../utils.mjs'

export class Rook extends Piece {
    constructor(square, $el, color) {
        super(square, $el, color)

        this.type = 'rook'
        this.calculateLegalMoves()
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
        let i = 1,
            squareId = this.square + inc * i,
            sq = _(squareId)

        if (this._checkIllegalSquare(line, this.square)) return

        while (sq) {
            if (sq.children.length) {
                if (sq.children[0].classList.contains(this.opposingColor)) {
                    this.legalMoves.push(squareId)
                    break
                }
                break
            }

            this.legalMoves.push(squareId)

            if (this._checkIllegalSquare(line, squareId)) break

            i++
            squareId = this.square + inc * i
            sq = _(squareId)
        }
    }

    calculateLegalMoves() {
        this.legalMoves = []
        // if (this._isColorTurn()) return

        this._calculateLine('N')
        this._calculateLine('S')
        this._calculateLine('E')
        this._calculateLine('W')
    }
}
