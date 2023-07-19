const { client, states } = require('../client')

module.exports = class Conversation {
    $states = states
    client = client

    msg = undefined
    state = undefined
    command = undefined

    constructor(msg) {
        this.msg = msg
        this.state = this.$states.find(
            (state) =>
                state.id === this.msg.from &&
                (state.author === this.msg.author
                    ? state.author === this.msg.author
                    : state.author === null)
        )
    }

    withCommand(command) {
        this.command = command
        return this
    }

    setState(state) {
        return this.$states.push(state)
    }

    destroyState() {
        return this.$states.pop(this.$states.indexOf(this.state))
    }

    complyCommand() {
        return this.msg.body === this.command
    }

    async action(callback) {
        callback(this)
    }
}
