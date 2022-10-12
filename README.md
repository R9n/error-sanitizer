## Express Error Sanitizer

[![Generic badge](https://img.shields.io/badge/tests-passing-<COLOR>.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/codestyle-standart-<COLOR>.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/dependencies-1-<COLOR>.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/version-1.0.0-<BLUE>.svg)](https://shields.io/)

### Express middleware for prevent **Sensitive Data Exposure**

error-sanitizer is a middleware for express to help prevent sensitive data exposure

#### What is sensitive data exposure?

Exposure of sensitive data can occur when an organization unknowingly exposes sensitive data or when a security incident leads to accidental or unlawful destruction, loss, alteration, unauthorized disclosure or access to sensitive data.
Unhandled errors are often exploited to gain access to confidential API information.This is a difficult problem to solve because information is something highly linked to the context, that is, in an api, only the developer can say if something is important or not and having this notion and/or performing this evaluation is something that not all developers do.

With this small middleware I try to help developers to minimally handle possible api errors, aiming to reduce as much as possible the number of important information leaked.

#### How this middleware works ?

This package focuses on sanitizing errors against specific values provided by the developer, as well as information present in the api's .env file.
The middleware will remove any value directly specified by the developer and properties present in the .env too

#### how to use ?

To use the middleware is simple. We have 3 exposed methods, **init**, **addVariableToBlackList**, **sanitizeErrors** .

**init**: Is called before all routes. Receive up to 4 args, this way:

**hidenMessage**: Customs message to replace sensitive data, default is "\*\*\*"

**removeStackTrace**: Boolean that indicates if the stack trace will be removed from the error before he's passed along. Is true by default.

**calbackOnError**: This is a callback that will be called `BEFORE` sanitization. This is usefull for you to performe any extra sanitization and/or send error data to some log api.

**removeEnv**: Boolean that indicates if the lib should remove all variables that are in .env from the error message. Is true by default.

The method **addVariableToBlackList** receive as argument an property that will be removed from the next errors messages.

The **sanitizeErrors** method is the midleware itself, and should be used after all routes of your api.

#### Example

```
const Express = require("express");

const { init, addVariableToBlackList, sanitizeErrors } = require("error-sanitizer");

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
    `generic error with sensitive data:
      ${String(process.env.DB_HOST)}:${String(process.env.DB_PORT)}
      api token: ${tokenFromSomeApi}`
  );

  // The process.env.DB_HOST and process.env.DB_PORT variables are in the env.example file
  // simulating variables that come from .env file
});

app.use(sanitizeErrors); // The middleware must be used after all your

app.listen(3000);

}
```

**Resulting error message is like this**: `generic error with sensitive data: ***:*** api token: ***`

### ✅ Tips to help to mitigate data exposure breach

- Sanitize all erros when possible
- Validate all and every user input that your api receive
- Ever check if the user has permissiont to do what he's trying to do

### ✅ A note about sensitive data exposure

The leak of sensitive data is one of the most difficult breaches to mitigate. This is because it can occur at several levels, at the networks layer, at the authentication layer.
That's why this lib focuses on sanitizing the errors, which are often used by hackers to get information about the apis they are trying to attack.
I suggest a little more in-depth reading on the owasp website: https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure

Hope this little package help you to make your api more secure 😀

#### License

![buils](https://img.shields.io/bower/l/mi)

#### About the author

Dev, security enthusiast, Gamer :D

**_LinkedIn_**: www.linkedin.com/in/ronaldo-mp

**_Github_**: https://github.com/R9n
