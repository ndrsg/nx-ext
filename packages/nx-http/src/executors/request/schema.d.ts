export interface RequestExecutorSchema {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    baseUrl?: string,
    data?: Record<string, unknown> | string,
    fromFile?: string,
    headers?: Record<string, string>,
    query?: Record<string, string>,
    responseFilePath?: string,
    acceptCodes?: number[],
    env?: Record<string, string>, 
    systemEnv?: boolean,
} // eslint-disable-line
