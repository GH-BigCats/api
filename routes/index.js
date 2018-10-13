const express = require('express')
const router = express.Router()

const { translate } = require('../utils/translate')
const { message } = require('../utils/watson')
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilio = require('twilio')(accountSid, authToken);

router.post('/', function(req, res, next) {
    const { Body, From } = req.body

    translate({ msg: Body })
    .then(result => {
        console.log('result', result)
        return result
    })
    message(Body)
        .then(answer => {
            return twilio.messages.create({
               body: answer,
               from: '+14159802287',
               to: From
             })
        })
      .then(message => console.log(message.sid))
      .done()
})

module.exports = router
