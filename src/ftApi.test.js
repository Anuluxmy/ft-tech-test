const { expect } = require('../test/chai');
const proxyquire = require('proxyquire').noCallThru();
const fetchMock = require('fetch-mock').sandbox();

const apiHost = 'http://api.ft.com';
const ftApiKey = '1234567890abcdef';
const mockResponse = {
  results: [{
    results: [{
      apiUrl: 'some.url',
      id: '12345',
      aspectSet: 'Article',
      title: {
        title: 'Some title'
      },
      summary: {
        summary: '...some summary...'
      }
    }]
  }]
};

const { search } = proxyquire('./ftApi', {
  'node-fetch': fetchMock,
  './config': {
    ftApiKey: ftApiKey
  }
});

describe('ftApi', () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  describe('#search(query)', () => {
    it('posts the query to the search endpoint', async () => {
      fetchMock.post(`${apiHost}/content/search/v1`, mockResponse, {
        name: 'search'
      });

      await search('brexit');

      expect(fetchMock.called('search')).to.be.true;
      const fetchOptions = fetchMock.lastOptions('search');
      const body = JSON.parse(fetchOptions.body);
      expect(body).has.property('queryString', 'brexit');
      expect(fetchOptions.headers).has.property('Content-Type', 'application/json');
      expect(fetchOptions.headers).has.property('X-Api-Key', ftApiKey);
    });
  });
});

