import { createElement, appendMany } from '../utils.mjs'
import { Square } from './Square.mjs'
import { Pawn } from '../chess/pieces/Pawn.mjs'

// setup board
const board = createElement({ classes: 'board' })

const squares = []

// setup squares
for (let x = 0; x < 8; x++) {
    const row = createElement({ classes: 'row' })

    const rowSquares = []
    for (let i = 0; i < 8; i++) {
        rowSquares.push(new Square(row))
    }

    squares.push(...rowSquares)
    appendMany(row, rowSquares)
    board.append(row)
}

document.body.append(board)

new Pawn('sq-50')
