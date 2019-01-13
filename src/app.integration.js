require('dotenv').config();

const { expect } = require('../test/chai');
const { supertest } = require('../test/supertest');
const cheerio = require('cheerio');
const app = require('./app');

const guidPattern = '[0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12}';
const articleRegex = new RegExp(`/article/${guidPattern}`);

describe('App', () => {
  describe('GET /', () => {
    it('renders an article', async () => {
      const response = await supertest(app).get('/');

      expect(response.status).to.eql(200);
      const $ = cheerio.load(response.text);

      expect($('title').text()).to.eql('FT Tech Test - Michael Allen');
    });
  });
});
