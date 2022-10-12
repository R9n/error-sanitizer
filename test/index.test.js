const {
  addVariableToBlackList,
  init,
  sanitizeErrors,
  getCurrentLibConfig,
} = require("../index");

const sinon = require("sinon");

describe("index.js", () => {
  afterEach(() => {
    init();
    sinon.restore();
  });

  it("Should remove sensitive data from error message", () => {
    const mockedRequest = {};

    const mockedResponse = {};

    const sensiveData1 = "1234";
    const sensiveData2 = "192.168.9.2";

    addVariableToBlackList(sensiveData1);

    addVariableToBlackList(sensiveData2);

    const customError = new Error(
      `token:${sensiveData1}  server-ip:${sensiveData2}`
    );

    function nextCalback(error) {
      return error;
    }

    try {
      throw customError;
    } catch (error) {
      const sanitizedError = sanitizeErrors(
        error,
        mockedRequest,
        mockedResponse,
        nextCalback
      );
      console.log(sanitizedError.message);
      const hasSensitiveData1 = sanitizedError.message.includes(sensiveData1);
      const hasSensitiveDat2 = sanitizedError.message.includes(sensiveData1);
      expect(hasSensitiveData1).toBe(false);
      expect(hasSensitiveDat2).toBe(false);
    }
  });

  it("Should config the lib correctly", () => {
    const mockedRequest = {};

    const mockedResponse = {};

    const sensiveData1 = "1234";
    const sensiveData2 = "192.168.9.2";

    init({
      hidenMessage: "-----",
      removeEnv: true,
    });

    addVariableToBlackList(sensiveData1);

    addVariableToBlackList(sensiveData2);

    const customError = new Error(
      `token:${sensiveData1}  server-ip:${sensiveData2}`
    );

    function nextCalback(error) {
      return error;
    }

    try {
      throw customError;
    } catch (error) {
      const sanitizedError = sanitizeErrors(
        error,
        mockedRequest,
        mockedResponse,
        nextCalback
      );
      const hasSensitiveData1 = sanitizedError.message.includes(sensiveData1);
      const hasSensitiveDat2 = sanitizedError.message.includes(sensiveData1);
      const hasCustomMessage = sanitizedError.message.includes("-----");

      expect(hasSensitiveData1).toBe(false);
      expect(hasSensitiveDat2).toBe(false);
      expect(hasCustomMessage).toBe(true);
    }
  });

  it("Should get lib config", () => {
    addVariableToBlackList("teste-1234");

    const libConfig = getCurrentLibConfig();

    expect(libConfig.blacklist.includes("teste-1234")).toBe(true);
    expect(libConfig.errorCalback).toBe(null);
    expect(libConfig.customHidenMessage).toBe("***");
    expect(libConfig.removeErrorStack).toBe(true);
  });
});
