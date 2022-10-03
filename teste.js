const Express = require('express');
const { init, addVariableToBlackList,sanitizeErrors } = require('./index');

require('dotenv').config();
console.log(process.env)

init()

const app = Express();
app.get('/',(request, response)=>{
    addVariableToBlackList('SJHDBJKSHDJSKHDHSN')

  throw new Error('generic error: '+ String(process.env.DB_HOST)+" : "+ String(process.env.DB_PORT));
  
  return response.send('sucesso')
})

app.use(sanitizeErrors);

app.listen(3000);

