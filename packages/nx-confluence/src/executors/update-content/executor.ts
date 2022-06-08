import { UpdateContentExecutorSchema } from './schema';

export default async function runExecutor(options: UpdateContentExecutorSchema) {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
