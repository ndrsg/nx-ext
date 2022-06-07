import { RequestExecutorSchema } from './schema';
import executor from './executor';
import MockAdapter from "axios-mock-adapter";
import axios from 'axios';
import { readFileSync } from 'fs';

const options: RequestExecutorSchema = {
  method: "GET",
  baseUrl: "https://base.url",
  url: "/5c0e348f-d188-4e54-8f6f-79efc75a87fe"
};

describe('Request Executor', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  })

  it('can run', async () => {
    mock.onGet(options.baseUrl + options.url).reply(200);
    const output = await executor(options);
    expect(output.success).toBe(true);
  });

  it('posts json body', async () => {
    mock.onPost(options.baseUrl + options.url).reply(200);
    const additionalOptions: Partial<RequestExecutorSchema> = {
      method: "POST",
      data: {
        some: "custom-data",
        arr: ["abc", "def"]
      }
    }

    const output = await executor({ ...options, ...additionalOptions});

    const request = mock.history.post[0];
    expect(JSON.parse(request.data)).toEqual(additionalOptions.data);
    expect(request.headers['Content-Type']).toBe('application/json');
    expect(output.success).toBe(true);
  });

  it('posts url-encoded data', async () => {
    mock.onPost(options.baseUrl + options.url).reply(200);

    const additionalOptions: Partial<RequestExecutorSchema> = {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        some: "custom-data",
        and: "other-data"
      }
    }

    const output = await executor({ ...options, ...additionalOptions});

    const request = mock.history.post[0];
    expect(request.data).toBe("some=custom-data&and=other-data");
    expect(request.headers['Content-Type']).toEqual('application/x-www-form-urlencoded');
    expect(output.success).toBe(true);
  });

  it('forwards query-string', async () => {
    mock.onPut(options.baseUrl + options.url).reply(200);

    const additionalOptions: Partial<RequestExecutorSchema> = {
      method: "PUT",
      query: {
        qp1: "1",
        qp2: "2"
      }
    }

    const output = await executor({ ...options, ...additionalOptions});

    const request = mock.history.put[0];
    expect(request.params).toEqual(additionalOptions.query);
    expect(output.success).toBe(true);
  });

  it('writes plain text response to file', async () => {
    const responseText = "some text"
    mock.onGet(options.baseUrl + options.url).reply(200, responseText, { "content-type": "text/plain; charset=UTF-8"});

    const additionalOptions: Partial<RequestExecutorSchema> = {
      responseFilePath: "./fileoutput/response.json"
    }

    const output = await executor({ ...options, ...additionalOptions});
    expect(readFileSync(additionalOptions.responseFilePath).toString()).toBe(responseText)
    expect(output.success).toBe(true);
  });

  it('writes json response to file', async () => {
    const responseJson = { some: "prop", and: "other" };
    mock.onGet(options.baseUrl + options.url).reply(200, responseJson, { "content-type": "application/json"});

    const additionalOptions: Partial<RequestExecutorSchema> = {
      responseFilePath: "./fileoutput/response.json"
    }

    const output = await executor({ ...options, ...additionalOptions});
    const fileContent = readFileSync(additionalOptions.responseFilePath).toString();
    const fileJson = JSON.parse(fileContent);
    expect(fileJson).toEqual(responseJson);
    expect(output.success).toBe(true);
  });

  it('fails on response code >= 400', async () => {
    try {
      await executor({ ...options});
    } catch(e) {
      expect(e).toBeDefined();
    }
  })

  it('does not fail on response code >= 400, if response code is accepted', async () => {
    const additionalOptions: Partial<RequestExecutorSchema> = {
      acceptCodes: [404]
    }
    const output = await executor({ ...options, ...additionalOptions});
    expect(output.success).toBe(true);
  });


  it('reads body from json file', async () => {
    mock.onPost(options.baseUrl + options.url).reply(200);

    const fromFileOptions: Partial<RequestExecutorSchema> = {
      method: "POST",
      fromFile: "./testfiles/body.json"
    }
    const output = await executor({ ...options, ...fromFileOptions});

    const fileContent = readFileSync(fromFileOptions.fromFile).toString();
    
    const request = mock.history.post[0];
    expect(request.data).toEqual(fileContent);
    expect(request.headers['Content-Type']).toBe("application/json");
    expect(output.success).toBe(true);
  });

  it('reads body from html file', async () => {

    mock.onPost(options.baseUrl + options.url).reply(200);

    const fromFileOptions: Partial<RequestExecutorSchema> = {
      method: "POST",
      fromFile: "./testfiles/body.html"
    }
    const output = await executor({ ...options, ...fromFileOptions});

    const fileContent = readFileSync(fromFileOptions.fromFile).toString();
    
    const request = mock.history.post[0];
    expect(request.data).toEqual(fileContent);
    expect(request.headers['Content-Type']).toBe("text/html; charset=UTF-8");
    expect(output.success).toBe(true);
  });
});
