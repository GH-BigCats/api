const { Translate } = require('@google-cloud/translate')

exports.translate = (msg, language) => {
    const translator = new Translate({
        projectId: process.env.PROJECT_ID
    })
    let detectedLang

    if (language) {
        console.log('language', language)
        return translator.translate(msg, language)
            .then(results => {
                const translation = results[0]
                console.log('results', results)
                return translation
            })
            .catch(err => console.log(err))
    }

    return translator.detect(msg)
        .then(detection => {
            detectedLang = detection[0].language
            return translator.translate(msg, 'en')
        })
        .then(results => {
            const translation = results[0]
            console.log('results', results)
            return { translation, detectedLang }
        })
        .catch(err => console.log(err))
}
