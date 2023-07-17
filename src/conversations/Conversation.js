module.exports = class Conversation {
    constructor(client, msg, states, command = undefined) {
        this.$states = states
        this.client = client
        this.msg = msg

        this.command = command

        this.state = ({ id = true, author = true, command = true }) => {
            return this.$states.find(
                (state) =>
                    (id ? state.id === this.msg.from : undefined) &&
                    (author
                        ? state.author === this.msg.author
                            ? state.author === this.msg.author
                            : state.author === null
                        : undefined) &&
                    (command ? state.command === this.command : undefined)
            )
        }
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
