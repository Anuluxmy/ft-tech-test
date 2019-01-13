const express = require('express');
const handlebars = require('express-handlebars');

const app = express();

app.engine('.hbs', handlebars({extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

const origamiComponents = [
  'o-header@^7.7.0',
  'o-footer-services@^2.0.3',
  'o-colors@^4.7.9',
  'o-topper@^2.3.2',
  'o-normalise@^1.6.2'
];
app.locals.oComponents = origamiComponents.join(',');

app.locals.githubRepo = 'https://github.com/michaeldfallen/ft-tech-test';
app.locals.title = 'FT Tech Test - Michael Allen'

app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;
