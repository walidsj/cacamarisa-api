require('dotenv').config()

module.exports = async (res) => {
    if (res.complyCommand()) {
        await res.client.sendMessage(
            res.msg.from,
            `Hai, saya adalah sebuah ChatBot bernama ${process.env.APP_NAME} 👋 Saya dioperasikan dengan mengirimkan perintah melalui !<perintah> yang tersedia.`
        )
    }
}
