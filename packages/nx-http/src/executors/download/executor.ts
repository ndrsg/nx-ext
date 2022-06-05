import { DownloadExecutorSchema } from './schema';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { logger } from '@nrwl/devkit';

export default async function runExecutor(
  options: DownloadExecutorSchema,
) {
  
  const filePath = options.targetPath;
  const url = options.url;
  const headers = options.headers;

  const file = createWriteStream(options.targetPath);

  await new Promise<void>((resolve, reject) => {
    get(url, { headers }, function(response) {
      
      if(response.statusCode >= 400) {
        reject("Response error: " + response.statusCode)
      }
      response.pipe(file);
      
      const size = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;
  
      response.on("data", (data: Uint8Array) => {
        downloaded += data.length;
        logger.debug(`Downloading ${url} ${downloaded}/${size} bytes - ${(100.0 * downloaded / size).toFixed(2)} %`);
      })
  
      file.on("finish", () => {
        file.close();
        logger.debug("Download of " + url + " finished to " + filePath);
        resolve();
      });
    });
  });
  
  return {
    success: true
  }
}

