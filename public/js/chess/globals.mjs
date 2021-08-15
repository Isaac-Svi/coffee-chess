import mouse from '../Mouse.mjs'

export let currentPlayer = 'light'

export const setCurrentPlayer = (x) => (currentPlayer = x)

// this contains actual Move objects
export const moves = []

// this keeps track of the square currently being hovered over
export let hoveredSquare = ''

const checkHoveredSquare = (square) => {
    const { left, right, top, bottom } = square.getBoundingClientRect()

    const checkX = mouse.x >= Math.floor(left) && mouse.x <= Math.ceil(right)
    const checkY = mouse.y >= Math.floor(top) && mouse.y <= Math.ceil(bottom)

    return checkX && checkY
}

const setHoveredSquare = () => {
    const squares = document.querySelectorAll('.square')

    for (const square of squares) {
        if (checkHoveredSquare(square)) {
            hoveredSquare = square
            return
        }
    }
}

window.addEventListener('mousemove', setHoveredSquare)
