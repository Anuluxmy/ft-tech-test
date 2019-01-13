const fetch = require('node-fetch');
const { ftApiKey } = require('./config');

const search = async (queryString) => {
  const res = await fetch('http://api.ft.com/content/search/v1', {
    method: 'POST',
    headers: {
      'X-Api-Key': ftApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      queryString,
      resultContext: {
        aspects: ['title', 'lifecycle', 'location', 'summary'],
        maxResults: 20
      }
    })
  });

  const body = await res.json();
  return body.results[0].results;
};

module.exports = { search };
