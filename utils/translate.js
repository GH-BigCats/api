const { Translate } = require('@google-cloud/translate')

exports.translate = ({ msg, language = 'en' }) => {
  const projectId = 'big-cats-1539444170038'
  const translator = new Translate({
    projectId
  })

  translator
    .translate(msg,language)
    .then(results => {
      const translation = results[0]
      console.log(`Msg: ${msg}`)
      console.log(`Translation: ${translation}`)
      return translation
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
}
