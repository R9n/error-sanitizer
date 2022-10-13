const Express = require("express");

const {
  init,
  addVariableToBlackList,
  sanitizeErrors,
  removeFromBlacklist,
} = require("../index");

function simpleErrorCallback(error) {
  console.log(`this callback will be called every time that an error happens, BEFORE error 
  sanitizaton !!`);
}

init({ calbackOnError: simpleErrorCallback });

const app = Express();

app.get("/", (request, response) => {
  const tokenFromSomeApi = "123456";

  addVariableToBlackList(tokenFromSomeApi); // you can add more variables to hide from unexpected erros

  removeFromBlacklist(String(process.env.API_NAME)); // The API_NAME is a property that i want to show on errros message, so i remove it from blacklist.

  throw new Error(
    `generic error with sensitive data:
      ${String(process.env.DB_HOST)}:${String(process.env.DB_PORT)} 
      api token: ${tokenFromSomeApi}
      Error on api: ${String(process.env.API_NAME)}
      `
  );

  // The process.env.DB_HOST and process.env.DB_PORT variables are in the env.example file
  // simulating variables that come from .env file
});

app.use(sanitizeErrors); // The middleware must be used after all your

app.listen(3000);
