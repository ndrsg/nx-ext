import { UploadExecutorSchema } from './schema';
import executor from './executor';
import * as express from 'express'
import { Server } from 'http';
import * as multer from 'multer';
const upload = multer({ dest: "./fileoutput/upload/"}); // note you can pass `multer` options here


import axios from 'axios';


describe('Upload Executor', () => {
  const server = express();
  let serverHook: Server;

  beforeAll(() => {
    axios.defaults.adapter = require('axios/lib/adapters/http');

    server.post("/", upload.single("file"), (req, res, next) => {
      console.log(req.file);
      res.send();
    })
    serverHook = server.listen(8080);
  });
  afterAll(() => serverHook.close());

  it('can run', async () => {
    const address = serverHook.address();

    const options: UploadExecutorSchema = {
      sourcePath: "./packages/nx-http/README.md",
      url: "http://localhost:8080",
      headers: {
        "origin": "localhost:8080"
      }
    };

    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});