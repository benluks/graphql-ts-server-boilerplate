import { createTypeormConn } from '../utils/createTypeormConn';
import { request } from 'graphql-request';
import { host } from './constants';
import { User } from '../entity/User';

beforeAll(async () => {
  await createTypeormConn();
});

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
}`;

describe('Register user', () => {
  it('test add user', async () => {
    const response = await request(host, mutation('ben@ben.com', 'test'));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email: 'ben@ben.com' } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual('ben@ben.com');
    expect(user.password).not.toEqual('test');
  });

  it('test duplicate email', async () => {
    const response2 = await request(host, mutation('ben@ben.com', 'test'));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: 'email',
      message: 'already taken',
    });
  });

  it('catch bad email format', async () => {
    const response3 = await request(host, mutation('benjamin', 'halloween'));
    expect(response3.register).toHaveLength(1);
    expect(response3.register[0].path).toEqual('email');
  });

  it('catch short email', async () => {
    const response4 = await request(host, mutation('b@', 'halloween'));
    expect(response4.register).toHaveLength(2);
    expect(response4.register[0].path).toEqual('email');
  });

  it('catch bad password', async () => {
    const response5 = await request(host, mutation('bob@bob.com', 'h'));
    expect(response5.register).toHaveLength(1);
    expect(response5.register[0].path).toEqual('password');
  });
});
