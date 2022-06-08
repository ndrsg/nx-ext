# nx-confluence

Nx executor to interact with Atlassian Confluence via its "REST" Api

## update-content
```json
{ 
  "targets": 
  {
    "confluence": {
      "executor": "@ndrsg/nx-confluence:update-content",
      "options": {
        "baseUrl": "https://conflucene.local",
        "beforeContent": "<ac:structured-macro ac:name=\"html\" ac:schema-version=\"1\" ac:macro-id=\"...\"><ac:plain-text-body><![CDATA[",
        "content": "./README.md",
        "afterContent": "]]></ac:plain-text-body></ac:structured-macro>",
        "contentId": "1234",
        "title": "The New Changelog for Version $CI_VERSION",
        "headers": {
          "Authorization": "Bearer $CONFLUENCE_TOKEN"
        },
        "contentConvert": "md2html+highlight.js"
      }
    }
  },
}
```
