import * as Redis from 'ioredis';
import fetch from 'node-fetch';

import { User } from '../entity/User';
import { createConfirmEmailLink } from '../utils/createConfirmEmailLink';
import { createTypeormConn } from '../utils/createTypeormConn';

let userId: string;
const redis = new Redis();

beforeAll(async () => {
  await createTypeormConn();
  const user = await User.create({
    email: 'ben10@ben.com',
    password: 'sjnkjngkjenkjgan',
  }).save();
  userId = user.id;
});

describe('test createConfirmEmailLink', () => {
  it('make sure createConfirmEmailLink works', async () => {
    const url = await createConfirmEmailLink(
      'http://localhost:4000',
      userId as string,
      redis
    );
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual('ok');
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
    const chunks = url.split('/');
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
  });

  it('sends `invalid` back if bad id sent', async () => {
    const response = await fetch('http://localhost:4000/confirm/8239857981');
    const text = await response.text();
    expect(text).toEqual('invalid');
  });
});
