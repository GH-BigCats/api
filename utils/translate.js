const { Translate } = require('@google-cloud/translate')

exports.translate = ({ msg, language = 'en' }) => {
    const translator = new Translate({
        projectId: process.env.PROJECT_ID
    })

    return translator.translate(msg,language)
        .then(results => {
            const translation = results[0]
            console.log('results', results)
            return translation
        })
        .catch(err => {
            console.error('ERROR:', err)
        })
}
