import { envSubst } from './envsubst';

describe('Request Executor', () => {
  
  it("replaces variables in strings", () => {
    const input = "${FIRST} $SECOND"
    const output = envSubst(input, {
      FIRST: "hello",
      SECOND: "world"
    });

    expect(output).toEqual("hello world");    
  })
  
  it("replaces variables in objects", () => {
    const input = {
      $FIRST: "$SECOND"
    }
    const output = envSubst(input, {
      FIRST: "hello",
      SECOND: "world"
    });

    expect(output).toEqual({ hello: "world"});    
  })

  it("doesnt replace unknown variables", () => {
    const input = {
      $SOME: "$THING"
    }
    const output = envSubst(input, {
      FIRST: "hello",
      SECOND: "world"
    });

    expect(output).toEqual({ $SOME: "$THING"});
  })

  it("works with nested structures", () => {
    const input = {
      $SOME: "$THING",
      any: [
        "string",
        "hello",
        "$SECOND"
      ]
    };
    const output = envSubst(input, {
      FIRST: "hello",
      SECOND: "world"
    });

    expect(output).toEqual({ $SOME: "$THING", any: ["string", "hello", "world"]});
  })

});