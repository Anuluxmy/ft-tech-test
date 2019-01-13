const express = require('express');
const supertest = require('supertest');
const handlebars = require('express-handlebars');

const testRouter = (...useArgs) => {
  const app = express();

  app.engine('.hbs', handlebars({extname: '.hbs', defaultLayout: 'main' }));
  app.set('view engine', '.hbs');

  app.use(...useArgs);
  return supertest(app);
};

module.exports = { supertest, testRouter };
