import { UploadExecutorSchema } from './schema';
import FormData = require('form-data');
import { createReadStream, readFileSync } from 'fs';
import axios from 'axios';
import { logger } from '@nrwl/devkit';
import { envSubstValues } from '../../common/envsubst';

export default async function runExecutor(
  options: UploadExecutorSchema,
) {
  
  options = envSubstValues(options, process.env);

  const filePath = options.sourcePath;
  const url = options.url;
  const size = readFileSync(filePath).length;
  
  const form = new FormData();
  const upStream = createReadStream(filePath);
  form.append('file', upStream);
  
  let uploaded = 0;  
  upStream.on("data", (data: Uint8Array) => {
    uploaded += data.length;
    logger.info(`Uploading ${filePath} to ${url}: ${uploaded}/${size} bytes - ${(100.0 * uploaded / size).toFixed(2)} %`);
  });
  
  const headers = { ...options.headers, ...form.getHeaders() }

  await axios.post(url, form, {
    headers
  });

  return {
    success: true
  }
}

