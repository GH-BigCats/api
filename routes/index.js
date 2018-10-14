const { translate } = require('../utils/translate')
const { watsonConversation } = require('../utils/watson')
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const twilio = require('twilio')(accountSid, authToken)
let detectedLang

exports.message = (req, res) => {
    const { Body, From } = req.body
    const replyFrom = From.includes('whatsapp:') ? 'whatsapp:+14155238886' : '+14159802287'

    translate(Body)
        .then(result => {
            detectedLang = result.detectedLang
            return result.translation
        })
        .then(msg => {
            return watsonConversation(msg)
        })
        .then(answer => {
            if (detectedLang === 'und') return answer
            return translate(answer, detectedLang)
        })
        .then(translatedAnswer => {
            twilio.messages.create({
               body: translatedAnswer,
               from: replyFrom,
               to: From
            })
            return res.end()
        })
        .catch(err => console.log(err))
}

exports.translate = (req, res) => {
    const { language, string } = req.query

    translate(string, language)
        .then(translation => {
            return res.send(translation)
        })
        .catch(err => console.log(err))
}
