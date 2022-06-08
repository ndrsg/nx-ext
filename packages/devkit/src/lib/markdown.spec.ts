import { writeFileSync } from 'fs';
import { mdToHtml, getHighlightCss } from './markdown';

describe('Request Executor', () => {
  
  it("converts markdown to html", () => {
    const result = mdToHtml("./testfiles/hello.md");
    expect(result).toContain("hello");
    expect(result).toContain("<");
    expect(result).toContain("</");
    expect(result).toContain(">");
  });

  it("highlights code", () => {
    const result = mdToHtml("./testfiles/code.md");
    writeFileSync("./fileoutput/code.html", result);
    expect(result).toContain("hljs");
  });

  it("provides code highlight css", () => {
    const result = getHighlightCss("github.css");
    expect(result).toContain("Light theme as seen on github.com")
  })
});