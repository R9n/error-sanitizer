const blacklist = [];

let customHidenMessage = '***';
let removeErrorStack = true;

async function clearData(error){
  console.log("error",error)
    if(removeErrorStack){
        delete error.stack;
    }
   
    for(const variable of blacklist){
      error.message = error.message.replace(variable, customHidenMessage);
    }
    
}
    
function parseEnv(){
  const parsedEnvKeys = Object.keys(process.env);
  for (const key of parsedEnvKeys) {
      blacklist.push(process.env[key]);
  }
}

function init({hidenMessage, removeStackTrace}={}){
  customHidenMessage = hidenMessage ?? '***';
  removeErrorStack = removeStackTrace ?? true;
  parseEnv();
 
}

function addVariableToBlackList(variable){
  if(!blacklist.includes(variable)){
    blacklist.push(variable);
  }
}


function sanitizeErrors (error, request, response, next) {
  
  if(error){
    clearData(error);
    
  }
   next(error);
}


module.exports = { sanitizeErrors, init, addVariableToBlackList }
