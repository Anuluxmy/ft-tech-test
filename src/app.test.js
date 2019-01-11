const { expect } = require('../test/chai');
const supertest = require('supertest');
const app = require('./app');

describe('App', () => {
  describe('GET /', () => {
    it('returns 200 OK', async () => {
      await supertest(app)
        .get('/')
        .expect(200);
    });
  });
});
