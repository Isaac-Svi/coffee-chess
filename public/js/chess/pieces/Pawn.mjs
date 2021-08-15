import { Piece } from './Piece.mjs'
import { moves, hoveredSquare } from '../globals.mjs'
import { _ } from '../../utils.mjs'

export class Pawn extends Piece {
    constructor(square, $el, color) {
        super(square, $el, color)

        this.type = 'pawn'
        this.didFirstMove = false
        this.mouseDown = false
        this.calculateLegalMoves()
    }

    /**
     * @description Checks if player of opposite color just did en passante and if this pawn can take advantage of that for this turn to kill it.
     */
    _canKillEnPassante() {
        const lastMove = moves[moves.length - 1]

        if (!lastMove) return null

        const { piece, prevSquare, newSquare } = lastMove

        const wasEP = Math.abs(newSquare - prevSquare) === 16
        const canKill = Math.abs(this.square - newSquare) === 1

        if (!(piece === 'pawn' && wasEP && canKill)) return null

        return this.square - newSquare === 1 ? 'W' : 'E'
    }

    _getBlockedDirections() {
        // returns true for each blocked direction

        // checks if something is not null
        const _n = (x) => x !== null

        const d = this.direction,
            s = this.square,
            E = s % 8 === 0,
            W = s % 8 === 7

        // NN is for en passante
        const NN = _(s + 16 * d).querySelector('.piece')
        const N = _(s + 8 * d).querySelector('.piece')
        const NE = _(s + 9 * d).querySelector('.piece')
        const NW = _(s + 7 * d).querySelector('.piece')

        // check if we can kill en passante of opponent
        // if we can, we get the direction of the kill. 'W' is left. 'E' is right.
        const side = this._canKillEnPassante()

        return {
            NN: _n(NN) || this.didFirstMove,
            N: _n(N),
            // following 2 are regular kills
            NE:
                !NE ||
                !NE.classList.contains(this.opposingColor) ||
                NE.classList.contains(this.color) ||
                E,
            NW:
                !NW ||
                !NW.classList.contains(this.opposingColor) ||
                NW.classList.contains(this.color) ||
                W,
            // following 2 are en passante kills
            NEE: side !== 'E' || E,
            NEW: side !== 'W' || W,
        }
    }

    calculateLegalMoves() {
        this.legalMoves = []
        // if (this._isColorTurn()) return

        const { NN, N, NE, NW, NEE, NEW } = this._getBlockedDirections()
        const d = this.direction,
            s = this.square

        if (!NN) this.legalMoves.push(s + 16 * d)
        if (!N) this.legalMoves.push(s + 8 * d)
        if (!NE || !NEE) this.legalMoves.push(s + 9 * d)
        if (!NW || !NEW) this.legalMoves.push(s + 7 * d)
    }

    makeMove() {
        const hoveredSquareId = Number(hoveredSquare.id.replace('sq-', ''))
        if (!this.legalMoves.includes(hoveredSquareId)) return

        // this just takes care of en passante
        if (hoveredSquare.innerHTML === '') {
            const id = hoveredSquareId + 8 * -this.direction
            document.getElementById(`sq-${id}`).innerHTML = ''
        }

        this.didFirstMove = true
        super.makeMove()
    }
}
