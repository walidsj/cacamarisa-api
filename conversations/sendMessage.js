const sendMessage = async (client, msg, states) => {
    try {
        if (
            !states.find(
                (state) =>
                    state.id === msg.from &&
                    (state.author === msg.author || state.author === null) &&
                    state.command === '!send a message'
            )
        ) {
            if (msg.body === '!send a message') {
                await msg.reply('_Kirim pesan ke nomor berapa?_')
                states.push({
                    id: msg.from,
                    author: msg.author ?? null,
                    step: 1,
                    command: msg.body,
                })
            }
        } else {
            const state = states.find((state) => state.id === msg.from)

            // State 2: Expecting the destination number
            if (state.step === 1) {
                if (msg.body.startsWith('62')) {
                    state.nomor = msg.body
                    await msg.reply(
                        `_Nomor ${msg.body} ditemukan! Apa isi pesannya?_`
                    )
                    state.step = 2
                } else {
                    await msg.reply(
                        '_Mohon kirimkan nomor dengan format 62..._'
                    )
                }
            }
            // State 3: Expecting the message content
            else if (state.step === 2) {
                const tujuan = await client.getNumberId(`${state.nomor}@c.us`)
                if (tujuan) {
                    await client.sendMessage(tujuan._serialized, msg.body)
                    await msg.reply('_Pesan berhasil dikirim!_ ✅')
                } else {
                    await msg.reply(
                        '_Nomor tujuan tidak ditemukan. Silakan coba lagi._'
                    )
                }
                // Reset the conversation state after completing the process
                states.pop(states.indexOf(state))
            }
        }
    } catch (error) {
        console.error('Error handling message:', error)
    }
}

module.exports = sendMessage
