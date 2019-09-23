//

const cachedDOMParser = new DOMParser();
export const parseHTML = (html) => {
  return cachedDOMParser.parseFromString(html, "text/html");
};