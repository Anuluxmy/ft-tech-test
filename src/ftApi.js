const fetch = require('node-fetch');
const { ftApiKey } = require('./config');

const search = async (queryString, { offset = 0, maxResults = 20 } = {}) => {
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
        maxResults,
        offset,
      }
    })
  });

  const body = await res.json();
  const { results = [], indexCount: totalResults } = body.results[0];

  const numResults = results.length;

  const first = numResults === 0 ? offset : offset+1;
  const last = offset+numResults;
  const currentPage = (offset / maxResults) + 1;
  const maxPages = Math.max(1, Math.ceil(totalResults / maxResults));
  const prevOffset = Math.max(0, offset-maxResults);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === maxPages;

  return {
    results: results,
    paging: {
      first, last, totalResults, prevOffset,
      currentPage, maxPages, isFirstPage, isLastPage
    }
  };
};

module.exports = { search };
