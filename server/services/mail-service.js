const nodemailer = require('nodemailer')

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to,
            subject: `Activation of website is ${process.env.API_URL}`,
            text: '',
            html: `<div><h1>Press me!</h1><a href="${link}">${link}</a></div>`
        })
    }
}

module.exports = new MailService()