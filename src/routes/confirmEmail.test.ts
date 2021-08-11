import fetch from 'node-fetch';

it('sends `invalid` back if bad id sent', async () => {
  const response = await fetch('http://localhost:4000/confirm/8239857981');
  const text = await response.text();
  expect(text).toEqual('invalid');
});
