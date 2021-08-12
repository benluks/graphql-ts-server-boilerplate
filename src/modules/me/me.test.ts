import axios from 'axios';
import { Connection } from 'typeorm';
import { User } from '../../entity/User';
import { host } from '../../tests/constants';
import { createTypeormConn } from '../../utils/createTypeormConn';

// let userId: string;
let conn: Connection;

const email = 'ben10@ben.com';
const password = 'sjnkjngkjenkjgan';

beforeAll(async () => {
  conn = await createTypeormConn();
  await User.create({
    email,
    password,
    confirmed: true,
  }).save();
});

afterAll(async () => {
  await conn.close();
});

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
}`;

const meQuery = `
{
  me {
    id
    email
  }
}`;

describe('me', () => {
  test('get current user', async () => {
    await axios.post(
      host as string,
      { query: loginMutation(email, password) },
      { withCredentials: true }
    );

    const response = await axios.post(
      host as string,
      { query: meQuery },
      { withCredentials: true }
    );

    console.log(response);
  });
});
