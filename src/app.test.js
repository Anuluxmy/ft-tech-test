const { expect } = require('../test/chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const { supertest } = require('../test/supertest');
const cheerio = require('cheerio');
const moment = require('moment');

const mockFtApi = {
  search: sinon.stub()
};
const singleResponse = [{
  id: 'some-id',
  title: { title: 'Some title' },
  summary: { excerpt: 'Some content...' },
  lifecycle: { initialPublishDateTime: moment().toISOString() }
}];

const mockResponse = [{
  id: 'some-id',
  title: { title: 'Some title' },
  summary: { excerpt: 'Some content...' },
  lifecycle: { initialPublishDateTime: moment().toISOString() }
}, {
  id: 'some-id',
  title: { title: 'Another title' },
  summary: { excerpt: 'Some other content...' },
  lifecycle: { initialPublishDateTime: moment().toISOString() }
}];


const app = proxyquire('./app', {
  './ftApi': mockFtApi
});

describe('App', () => {
  beforeEach(() => {
    mockFtApi.search.reset();
  });

  describe('GET /', () => {
    it('renders an article', async () => {
      mockFtApi.search.resolves(singleResponse);

      const response = await supertest(app).get('/');

      expect(response.status).to.eql(200);
      expect(mockFtApi.search).called;

      const $ = cheerio.load(response.text);
      expect($('title').text()).to.eql('FT Tech Test - Michael Allen');
      expect($('h2.o-teaser__heading').text().trim()).to.eql('Some title');
      expect($('p.o-teaser__standfirst').text().trim()).to.eql('Some content...');
    });
  });

  describe('GET /search', () => {
    it('renders the search results', async () => {
      mockFtApi.search.resolves(mockResponse);

      const response = await supertest(app)
        .get('/search')
        .query({ q: 'brexit' });

      expect(response.status).to.eql(200);
      expect(mockFtApi.search).calledWith('brexit');

      const $ = cheerio.load(response.text);
      expect($('title').text()).to.eql('Search results for "brexit"');

      const titles = $('h2.o-teaser__heading');
      expect(titles.length).to.eql(2);
      expect(titles.eq(0).text().trim()).to.eql('Some title');
      expect(titles.eq(1).text().trim()).to.eql('Another title');
    });
  });
});
