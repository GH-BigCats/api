const ConversationV1 = require('watson-developer-cloud/conversation/v1')
const axios = require('axios')

const sessions = []
const conversation = new ConversationV1({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version: '2017-05-26'
})

const message = (text, from) => {
    const currentSession = sessions.find(s => s.from === from) || {}
    const payload = {
        workspace_id: process.env.WORKSPACE_ID,
        input: {
            text
        },
        context: currentSession.context
    }

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

exports.watsonConversation = (msg, from) => message(msg, from)
    .then(response => {
    console.log(JSON.stringify(response, null, 2))

    let currentSession = sessions.find(s => s.from === from)

    if (!currentSession) {
        const session = {
            from,
            context: response.context
        }

        currentSession = session
        sessions.push(session)
    }
    if (response.context.system.branch_exited) {
        // conversation ended, clear session
        sessions.pop(currentSession)
    } else {
        currentSession.context = response.context
    }
    console.log(sessions)

    // POST watson object to beau's db
    axios.post('https://dx6yordlfj.execute-api.us-east-2.amazonaws.com/prod/save', JSON.stringify(response)).catch(err => console.log('beau\'s error', err))

    return response.output.text[0]
  })
  .catch(err => console.log(err))
