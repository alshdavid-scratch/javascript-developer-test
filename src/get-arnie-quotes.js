const { httpGet } = require("./mock-http-interface");

// Gross functional approach
const getArnieQuotesFunctional = async (urls) => {
  return (await Promise.all(urls.map(httpGet))).map((result) =>
    result.status >= 200 && result.status <= 299
      ? { "Arnie Quote": JSON.parse(result.body).message }
      : { "FAILURE": JSON.parse(result.body).message },
  );
};

// More readable approach, depending on taste
const getArnieQuotes = async (urls) => {
  /** @type {Array<Promise<{ 'Arnie Quote': string } | { 'FAILURE': string }>>} */
  const results = []

  for (const url of urls) {
    results.push(new Promise(res => setTimeout(async () => {
      const {status, body} = await httpGet(url)
      // Probably want to try/catch this
      const { message } = JSON.parse(body)
      if (status >= 200 && status <= 299) {
        res({ 'Arnie Quote': message })
      } else {
        res({ 'FAILURE': message })
      }
    })))
  }

  return Promise.all(results)
}

module.exports = {
  getArnieQuotes,
};
