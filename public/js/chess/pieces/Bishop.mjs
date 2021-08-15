import { Piece } from './Piece.mjs'
import { _ } from '../../utils.mjs'

export class Bishop extends Piece {
    constructor(square, $el, color) {
        super(square, $el, color)

        this.type = 'bishop'
        this.calculateLegalMoves()
    }

    diagonals = {
        NW: 9,
        NE: 7,
        SW: -7,
        SE: -9,
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

        this._calculateDiagonal('NW')
        this._calculateDiagonal('NE')
        this._calculateDiagonal('SW')
        this._calculateDiagonal('SE')
    }
}
