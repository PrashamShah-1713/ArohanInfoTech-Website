const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOTAL_REQUESTS = Number(process.env.TOTAL_REQUESTS || 1000);
const CONCURRENCY = Number(process.env.CONCURRENCY || 50);
const TARGET_PATH = process.env.TARGET_PATH || '/api/public/internships';
const METHOD = (process.env.METHOD || 'GET').toUpperCase();

function requestOnce(index) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.request(
      `${BASE_URL}${TARGET_PATH}`,
      { method: METHOD, headers: { 'Content-Type': 'application/json' } },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({
            index,
            status: res.statusCode,
            durationMs: Date.now() - start,
            bodyLength: body.length,
          });
        });
      }
    );

    req.on('error', (error) => {
      resolve({ index, status: 0, durationMs: Date.now() - start, error: error.message });
    });

    if (METHOD === 'POST') {
      req.write(JSON.stringify({ test: true, index }));
    }

    req.end();
  });
}

async function run() {
  const results = [];
  let index = 0;

  while (index < TOTAL_REQUESTS) {
    const batch = [];
    const batchSize = Math.min(CONCURRENCY, TOTAL_REQUESTS - index);

    for (let i = 0; i < batchSize; i += 1) {
      batch.push(requestOnce(index + i));
    }

    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    index += batchSize;
  }

  const successful = results.filter((item) => item.status >= 200 && item.status < 500);
  const failed = results.filter((item) => item.status === 0 || item.status >= 500);
  const durations = successful.map((item) => item.durationMs);
  const totalDuration = durations.reduce((sum, value) => sum + value, 0);
  const average = durations.length ? Math.round(totalDuration / durations.length) : 0;
  const max = durations.length ? Math.max(...durations) : 0;
  const min = durations.length ? Math.min(...durations) : 0;

  console.log('Load test summary');
  console.log(`Total requests: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Average duration: ${average}ms`);
  console.log(`Min duration: ${min}ms`);
  console.log(`Max duration: ${max}ms`);
  console.log('Sample failures:', failed.slice(0, 10));
}

run().catch((error) => {
  console.error('Load test failed:', error);
  process.exit(1);
});
