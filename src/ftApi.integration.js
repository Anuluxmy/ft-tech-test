require('dotenv').config();

const { expect } = require('../test/chai');
const { search } = require('./ftApi');

describe('ftApi', () => {
  describe('#search(query)', () => {
    it('returns a list of articles', async () => {
      const articles = await search('brexit');

      expect(articles).an.instanceof(Array);
      expect(articles.length).is.above(0).and.is.at.most(20);
      articles.forEach(article => {
        expect(article).has.property('apiUrl');
        expect(article).has.property('aspectSet');
        expect(article).has.property('id');
      });
    });
  });
});
