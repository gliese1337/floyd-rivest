import 'mocha';
import { expect } from 'chai';
import { select } from '../src';

describe("Floyd-Rivest Select Tests", () => {
  for (let t = 1; t <= 20; t++) {
    const items = Array.from({ length: 2048 }, () => (Math.random()*1024)|0);
    const sorted = [...items].sort((a,b) => a-b);
    for (let k = 64; k <= 1536; k += 64) {
      const s = sorted.slice(0, k);
      const copy = [...items];
      const kmin = select(copy, k);
      copy.length = k;
      it(`(${t}) Should get the ${k}-smallest element.`, () => {
        expect(kmin).to.eql(s[k-1]);
      });
      it(`(${t}) Should get ${k}-min elements.`, () => {
        expect(copy.sort((a,b) => a-b)).to.eql(s);
      });
    }
  }
});