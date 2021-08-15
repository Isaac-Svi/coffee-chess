import { Piece } from './Piece.mjs'
import { _ } from '../../utils.mjs'

export class Queen extends Piece {
    constructor(square, $el, color) {
        super(square, $el, color)

        this.type = 'queen'
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

    _calculateDiagonal(diagonal) {
        if (['NE', 'SE'].includes(diagonal) && this.square % 8 === 0) return
        if (['NW', 'SW'].includes(diagonal) && this.square % 8 === 7) return

        const inc = this.diagonals[diagonal]
        let i = 1,
            squareId = this.square + inc * i,
            sq = _(squareId)

        while (sq) {
            if (sq.children.length) {
                if (sq.children[0].classList.contains(this.opposingColor)) {
                    this.legalMoves.push(squareId)
                    break
                }
                break
            }

            this.legalMoves.push(squareId)

            if (squareId > 55 || squareId < 8) break
            if (squareId % 8 === 0 || squareId % 8 === 7) break

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

        this._calculateDiagonal('NW')
        this._calculateDiagonal('NE')
        this._calculateDiagonal('SW')
        this._calculateDiagonal('SE')
    }
}
