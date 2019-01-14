const express = require('express');
require('express-async-errors');

const ftApi = require('./ftApi');
const handlebars = require('express-handlebars');
const readableTimestamp = require('./readableTimestamp');

const app = express();

app.engine('.hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: { readableTimestamp }
}));
app.set('view engine', '.hbs');

const origamiComponents = [
  'o-header@^7.7.0',
  'o-footer-services@^2.0.3',
  'o-teaser@^2.3.2',
  'o-teaser-collection@^2.2.0',
  'o-fonts@^3.2.0',
  'o-grid@^4.4.4',
  'o-colors@^4.7.9',
  'o-topper@^2.3.2',
  'o-normalise@^1.6.2'
];
app.locals.oComponents = origamiComponents.join(',');

app.locals.githubRepo = 'https://github.com/michaeldfallen/ft-tech-test';
app.locals.title = 'FT Tech Test - Michael Allen'

app.use('/public', express.static('public'));

app.get('/', async (req, res) => {
  const results = await ftApi.search('');

  const randomIndex = Math.floor(Math.random() * results.length);
  res.render('index', { article: results[randomIndex] });
});

app.get('/search', async (req, res) => {
  const query = req.query.q || '';
  const results = await ftApi.search(query);
  res.render('search', {
    query,
    articles: results,
    title: `Search results for "${query}"`
  });
});

module.exports = app;
