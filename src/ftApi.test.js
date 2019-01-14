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

  describe('#search(query, offset=0)', () => {
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

    it('allows paging through an offset param', async () => {
      fetchMock.post(`${apiHost}/content/search/v1`, mockResponse, {
        name: 'search'
      });

      await search('brexit', { offset: 20 });

      expect(fetchMock.called('search')).to.be.true;
      const fetchOptions = fetchMock.lastOptions('search');
      const body = JSON.parse(fetchOptions.body);
      expect(body.resultContext).has.property('offset', 20);
    });

    it('calculates correct paging: offset = 0, total results = 100', async () => {
      const searchResponse = {
        results: [{
          results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          indexCount: 100
        }],
      };
      fetchMock.post(`${apiHost}/content/search/v1`, searchResponse, {
        name: 'search'
      });

      const { paging } = await search('brexit', { offset: 0, maxResults: 10 });

      expect(paging).has.property('first', 1);
      expect(paging).has.property('last', 10);
      expect(paging).has.property('totalResults', 100);
      expect(paging).has.property('prevOffset', 0);
      expect(paging).has.property('currentPage', 1);
      expect(paging).has.property('maxPages', 10);
      expect(paging).has.property('isFirstPage', true);
      expect(paging).has.property('isLastPage', false);
    });

    it('calculates correct paging: offset = 10, total results = 100', async () => {
      const searchResponse = {
        results: [{
          results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          indexCount: 100
        }],
      };
      fetchMock.post(`${apiHost}/content/search/v1`, searchResponse, {
        name: 'search'
      });

      const { paging } = await search('brexit', { offset: 10, maxResults: 10 });

      expect(paging).has.property('first', 11);
      expect(paging).has.property('last', 20);
      expect(paging).has.property('totalResults', 100);
      expect(paging).has.property('prevOffset', 0);
      expect(paging).has.property('currentPage', 2);
      expect(paging).has.property('maxPages', 10);
      expect(paging).has.property('isFirstPage', false);
      expect(paging).has.property('isLastPage', false);
    });

    it('calculates correct paging: offset = 10, total results = 15', async () => {
      const searchResponse = {
        results: [{
          results: [{}, {}, {}, {}, {}],
          indexCount: 15
        }],
      };
      fetchMock.post(`${apiHost}/content/search/v1`, searchResponse, {
        name: 'search'
      });

      const { paging } = await search('brexit', { offset: 10, maxResults: 10 });

      expect(paging).has.property('first', 11);
      expect(paging).has.property('last', 15);
      expect(paging).has.property('totalResults', 15);
      expect(paging).has.property('prevOffset', 0);
      expect(paging).has.property('currentPage', 2);
      expect(paging).has.property('maxPages', 2);
      expect(paging).has.property('isFirstPage', false);
      expect(paging).has.property('isLastPage', true);
    });

    it('calculates correct paging: offset = 0, total results = 0', async () => {
      const searchResponse = {
        results: [{
          indexCount: 0
        }],
      };
      fetchMock.post(`${apiHost}/content/search/v1`, searchResponse, {
        name: 'search'
      });

      const { paging } = await search('brexit', { offset: 0 });

      expect(paging).has.property('first', 0);
      expect(paging).has.property('last', 0);
      expect(paging).has.property('totalResults', 0);
      expect(paging).has.property('prevOffset', 0);
      expect(paging).has.property('currentPage', 1);
      expect(paging).has.property('maxPages', 1);
      expect(paging).has.property('isFirstPage', true);
      expect(paging).has.property('isLastPage', true);
    });
  });
});

