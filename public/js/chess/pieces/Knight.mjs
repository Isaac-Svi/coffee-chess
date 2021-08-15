import { Piece } from './Piece.mjs'
import { _ } from '../../utils.mjs'

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getCoord(sq) {
        return sq + this.x + this.y
    }
}

export class Knight extends Piece {
    constructor(square, $el, color) {
        super(square, $el, color)

        this.type = 'knight'
        this.calculateLegalMoves()
    }

    vectors = {
        NNE: new Vector(-1, 2 * 8),
        NEE: new Vector(-2, 1 * 8),
        NNW: new Vector(1, 2 * 8),
        NWW: new Vector(2, 1 * 8),
        SSE: new Vector(-1, -2 * 8),
        SEE: new Vector(-2, -1 * 8),
        SSW: new Vector(1, -2 * 8),
        SWW: new Vector(2, -1 * 8),
    }

    _calculateSpot(spot) {
        if (spot.includes('N') && this.square > 55) return
        if (spot.includes('S') && this.square < 8) return
        if (['NWW', 'SWW'].includes(spot) && this.square % 8 === 6) return
        if (['NNW', 'SSW'].includes(spot) && this.square % 8 === 7) return
        if (['NEE', 'SEE'].includes(spot) && this.square % 8 === 1) return
        if (['NNE', 'SSE'].includes(spot) && this.square % 8 === 0) return

        const newSquare = this.vectors[spot].getCoord(this.square)
        const sq = _(newSquare)

        if (
            !sq.children.length ||
            sq.children[0].classList.contains(this.opposingColor)
        ) {
            this.legalMoves.push(newSquare)
        }
    }

    calculateLegalMoves() {
        this.legalMoves = []
        // if (this._isColorTurn()) return

        this._calculateSpot('NNW')
        this._calculateSpot('NWW')
        this._calculateSpot('NNE')
        this._calculateSpot('NEE')
        this._calculateSpot('SWW')
        this._calculateSpot('SSW')
        this._calculateSpot('SSE')
        this._calculateSpot('SEE')
    }
}
