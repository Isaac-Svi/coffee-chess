import { hoveredSquare, moves, currentPlayer, setCurrentPlayer } from '../globals.mjs'
import { Move } from '../Move.mjs'

export class Piece {
    static color = { light: 'light', dark: 'dark' }
    static pieces = {
        light: [],
        dark: [],
    }

    constructor(square, $el, color) {
        this.color = Piece.color[color]

        Piece.pieces[this.color].push(this)

        this.opposingColor = this.color === 'light' ? 'dark' : 'light'
        this.direction = this.color === 'light' ? 1 : -1
        this.square = square
        this.legalMoves = []
        this.$el = $el
        this.mouseDown = false
        this.currentSquare = null // square that mouse is currently hovering over

        this.setupParents()

        this.$el.addEventListener('click', this.handleClick.bind(this))
        this.$el.addEventListener('mousedown', this.handleMouseDown.bind(this))
        window.addEventListener('mouseup', this.handleMouseUp.bind(this))
        window.addEventListener('mousemove', this.handleMouseMove.bind(this))
    }

    setupParents() {
        this.$parent = document.getElementById(`sq-${this.square}`)
        this.$parent.append(this.$el)
        this.$board = this.$el.parentNode.parentNode.parentNode
    }

    _isColorTurn() {
        return currentPlayer === this.opposingColor
    }

    calculateLegalMoves() {
        this.legalMoves = []
    }

    showLegalMoves() {
        this.calculateLegalMoves()

        for (const move of this.legalMoves) {
            const square = document.getElementById(`sq-${move}`)
            square.classList.add('highlighted')
        }
    }

    handleClick() {
        if (this._isColorTurn()) return

        document.querySelectorAll('.highlighted').forEach((el) => {
            el.classList.remove('highlighted')
        })
        this.showLegalMoves()
    }

    handleMouseDown() {
        if (this._isColorTurn()) return
        this.calculateLegalMoves()
        this.$el.classList.add('active')
        this.mouseDown = true
    }

    handleMouseUp() {
        if (!this.mouseDown) return

        this.$el.classList.remove('active')
        this.$el.style.top = 'unset'
        this.$el.style.left = 'unset'
        this.mouseDown = false

        this.makeMove()
    }

    handleMouseMove(e) {
        if (!this.mouseDown) return

        const pieceWidth = this.$el.offsetWidth

        this.$el.style.top = e.clientY - pieceWidth / 2 + 'px'
        this.$el.style.left = e.clientX - pieceWidth / 2 + 'px'
    }

    makeMove() {
        const hoveredSquareId = Number(hoveredSquare.id.replace('sq-', ''))

        if (!this.legalMoves.includes(hoveredSquareId)) return

        hoveredSquare.innerHTML = ''
        hoveredSquare.append(this.$el)

        moves.push(new Move(this.type, this.square, hoveredSquareId))
        this.square = hoveredSquareId

        setCurrentPlayer(this.opposingColor)
    }
}
