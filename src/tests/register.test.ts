import { createTypeormConn } from '../utils/createTypeormConn';
import { request } from 'graphql-request';
import { host } from './constants';
import { User } from '../entity/User';

beforeAll(async () => {
  await createTypeormConn();
});

const email = 'ben@ben.com';
const password = 'testtesttest';

// test email and password login
const mutation = `
mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
}`;

test('Register user', async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email: email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  const response2 = await request(host, mutation);
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0]).toEqual({
    path: 'email',
    message: 'already taken',
  });
});
