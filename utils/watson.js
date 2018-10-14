const ConversationV1 = require('watson-developer-cloud/conversation/v1')
const axios = require('axios')

const conversations = []
const conversation = new ConversationV1({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version: '2017-05-26'
})

const message = (text, context) => {
    const payload = {
        workspace_id: process.env.WORKSPACE_ID,
        input: {
            text
        },
        context
    }
    console.log(conversation)

    return new Promise((resolve, reject) => {
        return conversation.message(payload, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

exports.watsonConversation = (msg) => message(msg)
  .then(response => {
    console.log(JSON.stringify(response, null, 2))

    // POST watson object to beau's db
    axios.post('https://dx6yordlfj.execute-api.us-east-2.amazonaws.com/prod/save', JSON.stringify(response)).catch(err => console.log('beau\'s error'))

    return response.output.text[0]
  })
  .catch(err => console.log(err))
