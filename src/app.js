const qrcode = require('qrcode-terminal')
const express = require('express')
const SendMessage = require('./conversations/sendMessage')
const CancelCommand = require('./conversations/cancelCommand')
const Conversation = require('./conversations/Conversation')
const client = require('./client')

require('dotenv').config()

const app = express()
const port = process.env.APP_PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let authenticated = false

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
    console.log('Client is ready!')
})

client.on('authenticated', () => {
    authenticated = true
    console.log('AUTHENTICATED')
})

client.on('auth_failure', (msg) => {
    console.error('AUTHENTICATION FAILURE', msg)
})

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason)
})

client.on('message', async (msg) => {
    if (msg.body == '!help') {
        await client.sendMessage(
            msg.from,
            `Hai, saya adalah sebuah ChatBot bernama ${process.env.APP_NAME} 👋 Saya dioperasikan dengan mengirimkan perintah melalui !<perintah> yang tersedia.`
        )
    }
})

const states = []

client.on('message', async (msg) => {
    new Conversation(client, msg, states)
        .withCommand('!cancel')
        .action(async (c) => {
            if (c.complyCommand()) {
                if (c.state) {
                    c.destroyState()
                    await c.msg.reply('Perintah dibatalkan! ❌')
                } else {
                    await c.msg.reply(
                        'Tidak ada perintah yang sedang berlangsung! ❌'
                    )
                }
            }
        })

    //  new CancelCommand(client, msg, states)
    new SendMessage(client, msg, states)
})

client.initialize()

app.get('/', (req, res) => {
    res.json({ message: 'WhatsApp ChatBot by walidsj', authenticated })
})

app.post('/send-message', async (req, res) => {
    const { no, message } = req.body

    const number = `${no}@c.us`

    const numberDetails = await client.getNumberId(number)
    console.log(numberDetails)

    if (numberDetails) {
        const sendMessageData = await client.sendMessage(
            numberDetails._serialized,
            message
        )

        return res.status(200).json({
            message: 'Message sent successfully',
            data: sendMessageData,
        })
    } else {
        res.status(404).json({ message: `Number ${number} not found` })
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
