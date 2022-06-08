import { UpdateContentExecutorSchema } from './schema';
import executor from './executor';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { readFileSync } from 'fs';

const options: UpdateContentExecutorSchema = {
  content: "./fileoutput/code.html",
  baseUrl: "http://base.confluence.local",
  contentId: "1234567",
  title: "Test"
};

describe('Build Executor', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  })

  it('pushes content', async () => {
    const expectedPayload = {
      "type": "page",
      "status": "current",
      "title": "Test",
      "version": {
        "number": 2
      },
      "body": {
        "editor": {
          "value": "my-content",
          "representation": "storage"
        }
      }
    }

    mock.onGet().reply(200, { version: { number: 1 } });
    mock.onPut().reply(200);
    const output = await executor({ ...options, ...{ content: "my-content" }});
    
    expect(mock.history.put[0].data).toBe(JSON.stringify(expectedPayload))
    expect(output.success).toBe(true);
  });

  it('wrapps content', async () => {
    const wrapOptions: Partial<UpdateContentExecutorSchema> = {
      beforeContent: "<ac:structured-macro ac:name=\"html\" ac:schema-version=\"1\" ac:macro-id=\"abcdefghijklmn-opq-rst-1234-5553\"><ac:plain-text-body><![CDATA[",
      content: "./testfiles/code.html",
      afterContent: "]]></ac:plain-text-body></ac:structured-macro>"
    }

    const expectedPayload = {
      "type": "page",
      "status": "current",
      "title": "Test",
      "version": {
        "number": 2
      },
      "body": {
        "editor": {
          "value": wrapOptions.beforeContent + readFileSync(wrapOptions.content).toString() + wrapOptions.afterContent,
          "representation": "storage"
        }
      }
    }

    mock.onGet().reply(200, { version: { number: 1 } });
    mock.onPut().reply(200);
    const output = await executor({ ...options, ...wrapOptions});
    expect(mock.history.put[0].data).toBe(JSON.stringify(expectedPayload))
    expect(output.success).toBe(true);
  })

  it('prints response code on error', async () => {
    console.error = () => { return; };   
    try {
      await executor({ ...options })
    } catch (e) {
      expect(e).toBeDefined();
    }
  })
});