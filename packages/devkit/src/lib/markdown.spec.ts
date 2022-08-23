import { writeFileSync, readFileSync } from 'fs';
import { mdToHtml, getHighlightCss } from './markdown';

describe('Request Executor', () => {
  
  it("converts markdown to html", () => {
    const src = readFileSync("./testfiles/hello.md").toString();
    const result = mdToHtml(src);
    expect(result).toContain("hello");
    expect(result).toContain("<");
    expect(result).toContain("</");
    expect(result).toContain(">");
  });

  it("highlights code", () => {
    const src = readFileSync("./testfiles/code.md").toString();
    const result = mdToHtml(src);
    writeFileSync("./fileoutput/code.html", result);
    expect(result).toContain("hljs");
  });

  it("provides code highlight css", () => {
    const result = getHighlightCss("github.css");
    expect(result).toContain("Light theme as seen on github.com")
  })
});
