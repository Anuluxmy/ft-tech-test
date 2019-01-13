const { expect } = require('../test/chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const { supertest } = require('../test/supertest');
const cheerio = require('cheerio');
const moment = require('moment');

const mockFtApi = {
  search: sinon.stub()
};
const mockResponse = [{
  id: 'some-id',
  title: { title: 'Some title' },
  summary: { excerpt: 'Some content...' },
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
      mockFtApi.search.resolves(mockResponse);

      const response = await supertest(app).get('/');

      expect(response.status).to.eql(200);
      expect(mockFtApi.search).called;

      const $ = cheerio.load(response.text);
      expect($('title').text()).to.eql('FT Tech Test - Michael Allen');
      expect($('h2.o-teaser__heading').text().trim()).to.eql('Some title');
      expect($('p.o-teaser__standfirst').text().trim()).to.eql('Some content...');
    });
  });
});
