import { UploadExecutorSchema } from './schema';

export default async function runExecutor(
  options: UploadExecutorSchema,
) {
  console.log('Executor ran for Upload', options)
  return {
    success: true
  }
}

