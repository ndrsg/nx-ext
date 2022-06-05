# @ndrsg/nx-http

A @nrwl/nx plugin for executing http-requests e.g. for webhooks or API calls, file upload and file download


## Installation
```bash
npm install --save-dev @ndrsg/nx-http
```

## Usage
### Webhooks

```bash
nx run project-name:hook
```
```json
{
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "...",
  "projectType": "...",
  "targets": {
    "hook": {
      "executor": "@ndrsg/nx-http:request",
      "options": {
        "url": "https://webhook.site/5c0e348f-d188-4e54-8f6f-79efc75a87fe",
        "method": "POST",
        "data": {
          "custom": "data"
        },
        "headers": {
          "Content-Type": "application/json"
        },
        "query": {
          "queryparam1": "1",
          "queryparam2": "2"
        },
        "responseFilePath": "./fileoutput/test-hook.json"
      }
    }
  }
}
```

### File Upload

```bash
nx run project-name:upload
```
```json
{
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "...",
  "projectType": "...",
  "targets": {
    "upload": {
      "executor": "@ndrsg/nx-http:request",
      "options": {
        "url": "https://webhook.site/5c0e348f-d188-4e54-8f6f-79efc75a87fe/07cbd7de-0b89-412a-b29f-66ec78f1693b",
        "sourcePath": "./packages/nx-http/README.md",
        "headers": {}
      }
    },
  }
}
```


### File Download

```bash
nx run project-name:download
```
```json
{
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "...",
  "projectType": "...",
  "targets": {
    "download": {
      "executor": "@ndrsg/nx-http:request",
      "options": {
        "url": "https://webhook.site/token/5c0e348f-d188-4e54-8f6f-79efc75a87fe/request/0138ee58-d9a2-408e-b303-07557c759bfb/download/32702fb1-135f-4fd1-bcb0-a3fecda98a26",
        "targetPath": "./fileoutput/download.md"
      }
    },
  }
}
```