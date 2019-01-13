const getOrThrow = (key) => {
  if (process.env[key]) {
    return process.env[key];
  }
  throw new Error(`Missing expected env var ${key}`);
}

module.exports = {
  get ftApiKey() {
    return getOrThrow('HEADLINE_LICENSE_KEY');
  }
};
