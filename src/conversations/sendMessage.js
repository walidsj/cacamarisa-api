module.exports = class SendMessage {
    constructor(client, msg, states) {
        this.$states = states
        this.client = client
        this.msg = msg

        this.command = '!send msg'

        this.state = this.$states.find(
            (state) =>
                state.id === this.msg.from &&
                (state.author === this.msg.author
                    ? state.author === this.msg.author
                    : state.author === null) &&
                state.command === this.command
        )

        this.action(client, msg)
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

    async action(client, msg) {
        if (!this.state) {
            if (this.complyCommand()) {
                await msg.reply('Kirim pesan ke nomor berapa?')
                this.setState({
                    id: msg.from,
                    author: msg.author ?? null,
                    step: 1,
                    command: msg.body,
                })
            }
        } else {
            const state = this.state

            switch (state.step) {
                case 1: {
                    if (
                        msg.body.startsWith('+62') ||
                        msg.body.startsWith('62') ||
                        msg.body.startsWith('0')
                    ) {
                        state.nomor = msg.body
                            .replace(/[-\s+]/g, '')
                            .replace(/^0/, '62')
                        await msg.reply(
                            `Nomor ${state.nomor} ditemukan! Apa isi pesannya?`
                        )
                        state.step = 2
                    } else {
                        await msg.reply('Nomor tidak valid. Silakan coba lagi.')
                    }
                    break
                }

                case 2: {
                    const target = await client.getNumberId(
                        `${state.nomor}@c.us`
                    )
                    if (target) {
                        await client.sendMessage(target._serialized, msg.body)
                        await msg.reply('Pesan berhasil dikirim! ✅')
                    } else {
                        await msg.reply(
                            'Nomor tujuan tidak ditemukan. Silakan coba lagi.'
                        )
                    }

                    this.destroyState()
                    break
                }
            }
        }
    }
}
