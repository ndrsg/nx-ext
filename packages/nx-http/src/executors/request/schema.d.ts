export interface RequestExecutorSchema {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    baseUrl?: string,
    data?: Record<string, unknown>,
    headers?: Record<string, string>,
    query?: Record<string, string>,
    responseFilePath?: string,
    acceptCodes?: number[]
} // eslint-disable-line
