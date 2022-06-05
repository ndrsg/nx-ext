import { RequestExecutorSchema } from './schema';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';
import { logger } from '@nrwl/devkit'
import { fstat, writeFileSync } from 'fs';

export default async function runExecutor(options: RequestExecutorSchema) {
  
  logger.debug(options);

  const headers = {
    'content-type': 'application/json',
    ...options.headers
  }

  Object.keys(headers).forEach(_header => {
    headers[_header.toLowerCase()] = headers[_header];
    delete headers[_header]
  });
  
  const data = headers['content-type'] === 'application/x-www-form-urlencoded'
    ? options.data && new URLSearchParams(options.data as Record<string, string>)
    : options.data

  const response = await axios.request({
    baseURL: options.baseUrl,
    method: options.method,
    url: options.url,
    params: options.query,
    data,
    headers
  }).catch((error) => {
    const axiosError = error as AxiosError;
    if(axiosError.isAxiosError && axiosError.response) {
      return axiosError.response;
    }
    throw error;
  });

  const qs = options.query ? "?" + Object.keys(options.query).map(_key => `${_key}=${options.query[_key]}`).join("&") : '';
  const resultLog = options.method + " " + [options.baseUrl, options.url].join("/") + qs  + " -> " + response.status + " " + response.statusText;
  
  if(response.status >= 400) {
    if(options.acceptCodes && options.acceptCodes.includes(response.status)) {
      logger.warn(resultLog);
      logger.warn("Accepting failed http-request as configured in options.acceptCodes");
    } else {
      logger.error(resultLog);
      throw new Error("Request failed.")
    }
  } else {
    logger.info(resultLog);
  }
  
  if(options.responseFilePath) {
    writeResponseToFile(options.responseFilePath, response);
  }

  return {
    success: true,
  };
}

function writeResponseToFile(path: string, response: AxiosResponse<any, any>) {
  const data = response.data;
  const [ contentType, ...ec ] = response.headers['content-type']?.split("; ");

  switch (contentType) {
    case "text/plain":
      writeFileSync(path, data);
      break;
    case "application/json":
      writeFileSync(path, JSON.stringify(data));
      break;
    default:
      try {
        writeFileSync(path, data);
      } catch (err) {
        logger.warn(err);
        logger.warn("Cannot write response data. Unexpected response content-type: " + contentType ?? 'n/a');
      }
      break;
  }  
}