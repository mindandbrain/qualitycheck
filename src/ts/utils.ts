
/* currently not needed:

const cachedDOMParser = new DOMParser();
export const parseHTML = (html) => {
  return cachedDOMParser.parseFromString(html, "text/html");
};

*/

export const reduceHashFromString = (s: string, hash: number): number => {
  for (var i = 0; i < s.length; i++) {
      var char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
  }
  return hash;
};

export const hashFromString = (s: string): number => {
  return reduceHashFromString(s, 0);
};

const alphabet = (a: string) => {
  const ac: number = a.charCodeAt(0), bc: number = a.charCodeAt(1);
  const k = bc - ac + 1;
  
  let c = new Uint8Array(k);
  
  for (let i: number = 0; i < k; i++) {
    c[i] = ac + i;
  }
  
  return String.fromCharCode(...c);
}

const chars = alphabet("az") + alphabet("AZ");
export const hashToString = (hash: number): string => {
  var ret = "", base = chars.length;
  do {
      ret += chars.charAt(hash % base);
      hash = Math.floor(hash / base);
  } while (hash > 0);
  return ret;
}

export class HashBuilder {
  public hash: number = 0;
  
  reduceString(s: string): HashBuilder {
    this.hash = reduceHashFromString(s, this.hash);
    return this;
  }
  
  get stringHash(): string {
    return hashToString(this.hash);
  }
}

