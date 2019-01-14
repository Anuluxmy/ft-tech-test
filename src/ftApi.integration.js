require('dotenv').config();

const { expect } = require('../test/chai');
const { search } = require('./ftApi');

describe('ftApi', () => {
  describe('#search(query)', () => {
    it('returns a list of articles', async () => {
      const { results } = await search('brexit');

      expect(results).an.instanceof(Array);
      expect(results.length).is.above(0).and.is.at.most(20);
      results.forEach(article => {
        expect(article).has.property('apiUrl');
        expect(article).has.property('aspectSet');
        expect(article).has.property('id');
      });
    });

    it('allows paging through an offset param', async () => {
      const first20Articles = await search('brexit');
      const second20Articles = await search('brexit', { offset: 20 });

      expect(first20Articles).to.not.eql(second20Articles);
    });
  });
});
