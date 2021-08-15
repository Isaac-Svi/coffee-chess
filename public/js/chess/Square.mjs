import { createElement } from '../utils.mjs'
import mouse from '../Mouse.mjs'

export class Square {
    static currentId = 63
    static openSquare = null
    static checkMousePosition(square) {
        const { left, right, top, bottom } = square.$el.getBoundingClientRect()

        const checkX = mouse.x >= Math.floor(left) && mouse.x <= Math.ceil(right)
        const checkY = mouse.y >= Math.floor(top) && mouse.y <= Math.ceil(bottom)

        return checkX && checkY && square.id === Square.openSquare.id
    }

    constructor($row) {
        this.number = Square.currentId
        this.id = `sq-${Square.currentId--}`
        this.$row = $row
        this.open = false

        this._setupDOM()
        this._addEventListeners()
    }

    _setupDOM() {
        this.$el = createElement({ classes: 'square', id: this.id })
        this.$row.append(this.$el)
    }

    _addEventListeners() {
        this.$el.addEventListener('mousemove', this.handleMouseMove.bind(this))
        this.$el.addEventListener('mouseleave', this.handleMouseLeave.bind(this))
    }

    handleMouseMove() {
        this.open = true
        Square.openSquare = this
    }

    handleMouseLeave() {
        this.open = false
    }
}
