export class MoveHistory {
    constructor() {
        this.queue = []
    }
    push(move) {
        this.queue.push(move)
    }
}
