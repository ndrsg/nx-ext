import { DownloadExecutorSchema } from './schema';
import executor from './executor';
import { MockServer } from 'jest-mock-server';
import { createReadStream, readFileSync } from 'fs';
import axios from 'axios';

describe('Download Executor', () => {
  const server = new MockServer();

  beforeAll(async () => {
    axios.defaults.adapter = require('axios/lib/adapters/http');
    await server.start();
  });
  afterAll(() => server.stop());
  beforeEach(() => server.reset());

  it('downloads a test file', async () => {
    const file = readFileSync('./packages/nx-http/README.md');
    const stream = createReadStream('./packages/nx-http/README.md');

    server.get("/").mockImplementationOnce(ctx => {
      ctx.status = 200;
      ctx.body = stream;
      ctx.set('content-length', file.length);
    });

    const options: DownloadExecutorSchema = {
      url: server.getURL().toString(),
      targetPath: "./fileoutput/downloadedREADME.md"
    }

    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});