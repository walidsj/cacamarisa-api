const { Client, LocalAuth } = require('whatsapp-web.js')

module.exports = {
    client: new Client({
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
    }),
    states: [],
}
