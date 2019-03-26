import {createTransport} from 'nodemailer'
import {elfSetting} from 'elf-setting'

const transporter = createTransport({
    host: elfSetting.mail.smtpHost,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: elfSetting.mail.smtpUsername,
        pass: elfSetting.mail.smtpPassword
    }
})

interface attachmentProps {
    filename: string,
    path: string
}

interface sendMailProps {
    to: string,
    from?: string,
    subject: string,
    text: string,
    attachments?: Array<attachmentProps>
}

export default class MailService {
    static async sendMail(config: sendMailProps) {
        return new Promise((resolve, reject) => {
            transporter.sendMail(config, (err, info) => {
                if (err) return reject(err)
                resolve(info)
            })
        })
    }
}