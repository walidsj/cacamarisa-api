module.exports = class CancelCommand {
    constructor(client, msg, states) {
        this.$states = states
        this.client = client
        this.msg = msg

        this.command = '!cancel'

        this.state = this.$states.find(
            (state) =>
                state.id === this.msg.from &&
                (state.author === this.msg.author
                    ? state.author === this.msg.author
                    : state.author === null)
        )

        this.action(client, msg)
    }

    destroyState() {
        return this.$states.pop(this.$states.indexOf(this.state))
    }

    complyCommand() {
        return this.msg.body === this.command
    }

    async action(client, msg) {
        if (this.complyCommand()) {
            if (this.state) {
                this.destroyState()
                await msg.reply('Perintah dibatalkan! ❌')
            } else {
                await msg.reply(
                    'Tidak ada perintah yang sedang berlangsung! ❌'
                )
            }
        }
    }
}
