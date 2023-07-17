const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const express = require('express')
const sendMessage = require('./conversations/sendMessage')

require('dotenv').config()

const app = express()
const port = process.env.APP_PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--unhandled-rejections=strict',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu',
            '--disable-extensions',
            '--disable-infobars',
        ],
    },
})

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

// Create a state object to keep track of the conversation flow

const states = []
// Event handler for the 'message' event
client.on('message', async (msg) => {
    await sendMessage(client, msg, states)
})

// client.on('message', async (msg) => {
//     if (msg.body == '!panduan') {
//         msg.reply(`
// *📚 PANDUAN PENGGUNAAN CHATBOT 📚*

// ChatBot ini dioperasikan dengan mengirimkan perintah melalui !<nama_perintah> dan parameter input melalui {isian_data} tergantung pada ketentuan yang berlaku. Berikut adalah daftar perintah yang dapat digunakan:

// *📂 Bagian 1: Autentikasi*
// 📍 !admin -daftar {token: TOKEN} {nama: NAMA ADMIN} {password: PASSWOR}}

// *📂 Bagian 2: Perpesanan*
// 📍 !pesan -kirim {tujuan: NOMOR PENERIMA} {pesan: ISI PESAN}}
//         `)
//     }

//     if (msg.body.startsWith('!admin')) {
//         if (msg.body.includes('-daftar')) {
//             const token = msg.body.split('{token:')[1].split('}')[0].trim()
//             const nama = msg.body.split('{nama:')[1].split('}')[0].trim()
//             const password = msg.body
//                 .split('{password:')[1]
//                 .split('}')[0]
//                 .trim()

//             if (token == process.env.ADMIN_TOKEN) {
//                 const User = require('./models').User

//                 User.create({
//                     number: msg.from.split('@')[0],
//                     name: nama,
//                     password: password,
//                 })
//                     .then((user) => {
//                         msg.reply(
//                             `Selamat ${user.name}, Anda telah terdaftar sebagai admin.`
//                         )
//                     })
//                     .catch((err) => {
//                         msg.reply(
//                             `Mohon maaf, terjadi kesalahan saat mendaftarkan akun Anda.`
//                         )
//                     })
//             } else {
//                 msg.reply(`Mohon maaf, token yang Anda masukkan salah.`)
//             }
//         }
//     }

//     if (msg.body.startsWith('!pesan')) {
//         if (msg.body.includes('-kirim')) {
//             const User = require('./models').User

//             const user = await User.findOne({
//                 where: {
//                     number: msg.from.split('@')[0],
//                 },
//             })

//             if (!user) {
//                 msg.reply(
//                     `Mohon maaf, nomor Anda tidak terdaftar sebagai admin.`
//                 )
//             }

//             if (msg.body.includes('-kirim')) {
//                 const tujuan = msg.body
//                     .split('{tujuan:')[1]
//                     .split('}')[0]
//                     .trim()
//                 const pesan = msg.body.split('{pesan:')[1].split('}')[0].trim()

//                 const userDetail = await client.getNumberId(`${tujuan}@c.us`)
//                 if (userDetail) {
//                     await client.sendMessage(userDetail._serialized, pesan)

//                     msg.reply(`Pesan anda ke ${tujuan} sukses dikirim.`)
//                 } else {
//                     msg.reply(`Mohon maaf, nomor tidak terdaftar di whatsapp.`)
//                 }
//             }
//         }
//     }
// })

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
