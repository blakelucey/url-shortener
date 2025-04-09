import { UAParser } from 'ua-parser-js';

export function parseUserAgent(userAgent) {
  const parser = new UAParser(); // Now this works!
  parser.setUA(userAgent);
  const result = parser.getResult();
  return {
    os: result.os.name || 'Unknown',
    browser: result.browser.name || 'Unknown',
  };
}