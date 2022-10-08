const dotEnvVariables = require("dotenv").config();

const blacklist = [];

let errorCalback;

let customHidenMessage = "***";

let removeErrorStack = true;

async function clearData(error) {
  if (removeErrorStack) {
    delete error.stack;
  }
  for (const variable of blacklist) {
    error.message = error.message.replace(variable, customHidenMessage);
  }
}

function parseEnv() {
  const envVariables = Object.keys(dotEnvVariables.parsed);

  for (const key of envVariables) {
    blacklist.push(dotEnvVariables.parsed[key]);
  }
}

function init({
  hidenMessage,
  removeStackTrace,
  calbackOnError,
  removeEnv = true,
} = {}) {
  customHidenMessage = hidenMessage ?? "***";
  removeErrorStack = removeStackTrace ?? true;
  errorCalback = calbackOnError ?? null;
  if (removeEnv) {
    parseEnv();
  }
}

function addVariableToBlackList(variable) {
  if (!blacklist.includes(variable)) {
    blacklist.push(variable);
  }
}

function sanitizeErrors(error, request, response, next) {
  if (error) {
    if (errorCalback) {
      errorCalback(error);
    }
    clearData(error);
  }
  next(error);
}

module.exports = { sanitizeErrors, init, addVariableToBlackList };
