export interface UpdateContentExecutorSchema {
  baseUrl: string
  content: string,
  contentId: string,
  title: string,
  fromFile?: boolean | 'autodetect',
  beforeContent?: string,
  afterContent?: string,
  headers?: Record<string, string>,
  contentConvert?: "md2html+highlight.js" | "md2html"
} // eslint-disable-line
