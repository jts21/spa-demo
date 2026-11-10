const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../app');

let server, base;

before(async () => {
  await new Promise(resolve => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET /health returns ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(await res.json(), { status: 'ok' });
});

test('POST /api/tasks creates a task', async () => {
  const res = await fetch(`${base}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Write tests' })
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual((await res.json()).title, 'Write tests');
});

test('POST /api/tasks rejects empty title', async () => {
  const res = await fetch(`${base}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '   ' })
  });
  assert.strictEqual(res.status, 400);
});

test('unknown route serves the SPA', async () => {
  const res = await fetch(`${base}/some/route`);
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /<main id="app">/);
});
