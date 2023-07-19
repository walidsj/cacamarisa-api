module.exports = async (res) => {
    if (!res.state) {
        if (res.complyCommand()) {
            await res.msg.reply('Kirim pesan ke nomor berapa?')
            res.setState({
                id: res.msg.from,
                author: res.msg.author ?? null,
                step: 1,
                command: res.msg.body,
            })
        }
    } else {
        const state = res.state

        switch (state.step) {
            case 1: {
                if (
                    res.msg.body.startsWith('+62') ||
                    res.msg.body.startsWith('62') ||
                    res.msg.body.startsWith('0')
                ) {
                    state.nomor = res.msg.body
                        .replace(/[-\s+]/g, '')
                        .replace(/^0/, '62')
                    await res.msg.reply(
                        `Nomor ${state.nomor} ditemukan! Apa isi pesannya?`
                    )
                    state.step = 2
                } else {
                    await res.msg.reply('Nomor tidak valid. Silakan coba lagi.')
                }
                break
            }

            case 2: {
                const target = await res.client.getNumberId(
                    `${state.nomor}@c.us`
                )
                if (target) {
                    await res.client.sendMessage(
                        target._serialized,
                        res.msg.body
                    )
                    await res.msg.reply('Pesan berhasil dikirim! ✅')
                } else {
                    await res.msg.reply(
                        'Nomor tujuan tidak ditemukan. Silakan coba lagi.'
                    )
                }

                res.destroyState()
                break
            }
        }
    }
}
