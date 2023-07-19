const qrcode = require('qrcode-terminal')
const express = require('express')
const Conversation = require('./lib/Conversation')
const { client } = require('./client')
const clear = require('./conversations/clear')
const help = require('./conversations/help')
const sendMessage = require('./conversations/send-message')

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
    new Conversation(msg).withCommand('!help').action(help)
    new Conversation(msg).withCommand('!clear').action(clear)
    new Conversation(msg).withCommand('!send').action(sendMessage)
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
