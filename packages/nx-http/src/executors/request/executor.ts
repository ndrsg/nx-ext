import { RequestExecutorSchema } from './schema';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';
import { logger } from '@nrwl/devkit'
import { readFileSync, writeFileSync } from 'fs';
import { envSubst, envSubstValues } from '../../common/envsubst';

export default async function runExecutor(options: RequestExecutorSchema) {

  // get data before env-substing for seperate handling  
  let data: Record<string, unknown> | URLSearchParams | string = options.data;

  options = envSubstValues(options, { 
    ...process.env
  });
  
  logger.debug(options);

  const headers = {
    ...options.headers
  }


  if(data && options.fromFile) {
    logger.warn("Cannot read body from file, hence data is already set");
  } else if(options.fromFile) {
    data = readFileSync(options.fromFile).toString();
  }

  if(options.env) {
    data = envSubst(data, options.env);
  }

  if(options.systemEnv) {
    data = envSubst(data, process.env);
  }

  if(headers['Content-Type'] === 'application/x-www-form-urlencoded' && options.data && typeof options.data === "object") {
    data = new URLSearchParams(options.data as Record<string, string>);
  }

  if(!headers['Content-Type'] && options.fromFile) {
    headers['Content-Type'] = "text/plain; charset=UTF-8";

    switch (options.fromFile.split(".").pop()) {
      case "json":
        headers['Content-Type'] = "application/json";
        break;
      case "htm":
      case "html":
        headers['Content-Type'] = "text/html; charset=UTF-8"
        break;
      default:
        break;
    }
  }

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
  const [ contentType ] = response.headers && response.headers['content-type'] ? response.headers['content-type'].split("; ") : "";

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