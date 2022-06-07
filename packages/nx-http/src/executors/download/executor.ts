import { DownloadExecutorSchema } from './schema';
import { createWriteStream, ReadStream } from 'fs';
import { logger } from '@nrwl/devkit';
import axios from 'axios';
import { envSubstValues } from '../../common/envsubst';

export default async function runExecutor(
  options: DownloadExecutorSchema,
) {

  options = envSubstValues(options, process.env);
  
  const filePath = options.targetPath;
  const url = options.url;
  const headers = options.headers;

  const file = createWriteStream(options.targetPath);

  const response = await axios.get<ReadStream>(url, { headers, responseType: "stream" });
  if(response.status >= 400) {
    throw new Error("Response error: " + response.status)
  }

  response.data.pipe(file);

  const size = parseInt(response.headers['content-length'], 10);
  let downloaded = 0;

  response.data.on("data", (data: Uint8Array) => {
    downloaded += data.length;
    logger.debug(`Downloading ${url} ${downloaded}/${size} bytes - ${(100.0 * downloaded / size).toFixed(2)} %`);
  })
  
  await new Promise<void>((resolve, reject) => {
    file.on("finish", () => {
      file.close();
      logger.debug("Download of " + url + " finished to " + filePath);
      resolve();
    });
  });

  return {
    success: true
  }
}

