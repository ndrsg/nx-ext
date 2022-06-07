![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ndrsg/nx-ext/Test)
[![codecov](https://codecov.io/gh/ndrsg/nx-ext/branch/main/graph/badge.svg?token=GQVAC57U3Q)](https://codecov.io/gh/ndrsg/nx-ext)
![npm](https://img.shields.io/npm/v/@ndrsg/nx-http?label=%40ndrsg%2Fnx-http)
![npm](https://img.shields.io/npm/dw/@ndrsg/nx-http?label=downloads%20%40ndrsg%2Fnx-http)

# @ndrsg/nx-http

A @nrwl/nx plugin for executing http-requests e.g. for webhooks or API calls, file upload and file download


## Installation
```bash
npm install --save-dev @ndrsg/nx-http
```

## Usage
You can use system environment variables in all option values, e.g. for setting up an 'Authorization' header.\
But options.env is only used for request-data!

### Webhooks

```bash
nx run project-name:hook
```
```json
{
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
    },
    "create-page": {
      "executor": "@ndrsg/nx-http:request",
      "options": {
        "baseUrl": "https://my-wiki",
        "url": "/home",
        "method": "POST",
        "fromFile": "./testfiles/template.html",
        "headers": {
          "Authorization": "Bearer $CI_AUTHORIZATION_TOKEN"
        },
        "systemEnv": true,
        "env": {
          "CONTENT": "<p>Released nx-http</p>"
        }
      },
      "configurations": {
        "dev": {
          "url": "/dev",
          "env": {
            "CONTENT": "<p>Realeased nx-http DEV</p>"
          }
        }
      }
    }
  }
}
```
template.html for nx run my-project:create-page
```html
<html>
  <body>
    <div>
      $CONTENT
    </div>
    <div>
      $CI_BRANCH_NAME
    </div>
  </body>
</html>
```

### File Upload

```bash
nx run project-name:upload
```
```json
{
  "sourceRoot": "...",
  "projectType": "...",
  "targets": {
    "upload": {
      "executor": "@ndrsg/nx-http:upload",
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
  "sourceRoot": "...",
  "projectType": "...",
  "targets": {
    "download": {
      "executor": "@ndrsg/nx-http:download",
      "options": {
        "url": "https://webhook.site/token/5c0e348f-d188-4e54-8f6f-79efc75a87fe/request/0138ee58-d9a2-408e-b303-07557c759bfb/download/32702fb1-135f-4fd1-bcb0-a3fecda98a26",
        "targetPath": "./fileoutput/download.md"
      }
    },
  }
}
```