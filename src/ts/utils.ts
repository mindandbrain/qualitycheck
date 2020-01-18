
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

export const hashChars = alphabet("az") + alphabet("AZ");
export const hashToString = (hash: number): string => {
  var uhash = new Uint32Array(1);
  uhash[0] = hash;
  
  var ret = "", base = hashChars.length;
  do {
      ret += hashChars.charAt(uhash[0] % base);
      uhash[0] = Math.floor(uhash[0] / base);
  } while (uhash[0] > 0);
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

