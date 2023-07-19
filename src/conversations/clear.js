module.exports = async (res) => {
    if (res.complyCommand()) {
        if (res.state) {
            res.destroyState()
            await res.msg.reply('Perintah dibatalkan! ❌')
        } else {
            await res.msg.reply(
                'Tidak ada perintah yang sedang berlangsung! ❌'
            )
        }
    }
}
