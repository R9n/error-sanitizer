const Express = require("express");

const { init, addVariableToBlackList, sanitizeErrors } = require("./index");

require("dotenv").config();

function simpleErrorCallback(error) {
  console.log(`this callback will be called every time that an error happens, BEFORE error 
  sanitizaton !!`);
}

init({ calbackOnError: simpleErrorCallback });

const app = Express();

app.get("/", (request, response) => {
  const tokenFromSomeApi = "123456";

  addVariableToBlackList(tokenFromSomeApi); // you can add more variables to hide from unexpected erros

  throw new Error(
    "generic error with sensitive data: " +
      String(process.env.DB_HOST) +
      " : " +
      String(process.env.DB_PORT) +
      "api token: " +
      tokenFromSomeApi
  );
});

app.use(sanitizeErrors);

app.listen(3000);
