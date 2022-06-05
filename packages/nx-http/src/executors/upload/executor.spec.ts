import { UploadExecutorSchema } from './schema';
import executor from './executor';

const options: UploadExecutorSchema = {};

describe('Upload Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});