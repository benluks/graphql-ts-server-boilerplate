import request from 'graphql-request';
import { Connection } from 'typeorm';
import { User } from '../../entity/User';
import { host } from '../../tests/constants';
import { createTypeormConn } from '../../utils/createTypeormConn';

const registerMutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
}`;

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
}`;

const login = async (e: string, p: string, errMsg: string) => {
  const response = await request(host as string, loginMutation(e, p));
  expect(response).toEqual({ login: [{ path: 'email', message: errMsg }] });
};

const email = 'blackbeans@ben.com';
const password = 'mypassword';

let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConn();
});
afterAll(async () => {
  await conn.close();
});

describe('login', () => {
  it('login with unregistered email', async () => {
    await login(email, password, 'invalid login');
  });
  it('email not confirmed', async () => {
    //   create user
    await request(host as string, registerMutation(email, password));

    // attempt to login
    await login(email, password, 'please confirm email');
  });
  it('bad password', async () => {
    await User.update({ email: email }, { confirmed: true });

    await login(email, 'gsjhbjhbjhehdd', 'invalid login');
  });
  it('good login', async () => {
    const response = await request(
      host as string,
      loginMutation(email, password)
    );
    expect(response).toEqual({ login: null });
  });
});
