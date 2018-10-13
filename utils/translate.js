exports.translate = (config) => {
    console.log(config);
    var msg = "hello";
    var language = "es";
    msg = config.msg;
    language = config.language;

   const {Translate} = require('@google-cloud/translate');
  
  // Your Google Cloud Platform project ID
  const projectId = 'big-cats-1539444170038';
  
  // Instantiates a client
  const translate = new Translate({
    projectId: projectId,
  });
  // Translates some text
  translate
    .translate(msg,language)
    .then(results => {
      const translation = results[0];
      console.log(`Msg: ${msg}`);
      console.log(`Translation: ${translation}`);
      return translation;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}