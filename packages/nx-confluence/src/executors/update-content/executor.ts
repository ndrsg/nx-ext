import axios from 'axios';
import { existsSync, readFileSync } from 'fs';
import { UpdateContentExecutorSchema } from './schema';
import { envSubstValues } from '@ndrsg/devkit';
import { logger } from '@nrwl/devkit';

export default async function runExecutor(options: UpdateContentExecutorSchema) {
  options = envSubstValues(options, process.env)
  
  if(!options.fromFile || options.fromFile === "autodetect") {
    existsSync(options.content) ? options.fromFile = true : options.fromFile = false;
  }

  const content = options.fromFile ? readFileSync(options.content).toString() : options.content;
  const combinedContent = [
    options.beforeContent,
    content,
    options.afterContent
  ].join("");  
  
  try {
    await updateContent(options.baseUrl, options.contentId, combinedContent, options.title, options.headers);
  } catch(e) {
    logger.error(e);
    throw e;
  }

  return {
    success: true,
  };
}

async function getCurrentVersion(baseURL: string, id: string, headers: Record<string, string>): Promise<number> {
  return axios.get(`/rest/api/content/${id}?expand=version`, { baseURL, headers }).then(resp => resp.data.version.number as number).catch(e => {
    logger.error("Cannot retreive current version from " + baseURL + `/rest/api/content/${id}?expand=version`);
    throw e
  });
}

async function updateContent(baseURL: string, id: string, content: string, title: string, headers: Record<string, string>) {
  return axios.put(`/rest/api/content/${id}`, 
    {
      type: "page",
      status: "current",
      title: title,
      version: {
        number: await getCurrentVersion(baseURL, id, headers) + 1
      },
      body: {
        editor: {
          value: content,
          representation:"storage"
        }
      }
    },
    {
      baseURL
    }
  )
}