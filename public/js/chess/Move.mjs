export class Move {
    /**
     *
     * @param {String} piece name of the piece
     * @param {Number} prevSquare square number of previous location of piece
     * @param {Number} newSquare square number of new location of piece
     */
    constructor(piece, prevSquare, newSquare) {
        this.piece = piece
        this.prevSquare = prevSquare
        this.newSquare = newSquare
    }
}
