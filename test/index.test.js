describe("index.js", () => {
  it("Should return a correct parsed query object when any property is passed twice", () => {
    const request = {
      query: {
        id: [1, 2, 3],
        name: ["value1", "value2"],
        lastName: "teste",
      },
    };
    const response = {
      status: () => {
        return {
          send: () => {
            return this;
          },
        };
      },
    };

    const next = () => {
      return request;
    };

    const generatedMiddleware = HppPrevent.hppPrevent();
    const parsedRequest = generatedMiddleware(request, response, next);

    expect(parsedRequest.query.id).toBe(3);
    expect(parsedRequest.query.name).toBe("value2");
    expect(parsedRequest.query.lastName).toBe("teste");
  });
});
