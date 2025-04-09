import { UAParser } from 'ua-parser-js';

export function parseUserAgent(userAgent) {
  const parser = new UAParser(); // Now this works!
  parser.setUA(userAgent);
  const result = parser.getResult();
  const deviceType = result.device.type || 'desktop';
  return {
    deviceType,
    os: result.os.name || 'Unknown',
    browser: result.browser.name || 'Unknown',
  };
}