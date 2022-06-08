export interface UpdateContentExecutorSchema {
  baseUrl: string
  content: string,
  contentId: string,
  title: string,
  fromFile?: boolean | 'autodetect',
  beforeContent?: string,
  afterContent?: string,
  headers?: Record<string, string>,
} // eslint-disable-line
