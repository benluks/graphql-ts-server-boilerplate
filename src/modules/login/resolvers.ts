import * as bcrypt from 'bcrypt';

import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { GQL } from '../../types/schema';

const errorResponse = [
  {
    path: 'email',
    message: 'invalid login',
  },
];

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (_, { email, password }: GQL.ILoginOnMutationArguments) => {
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: 'email',
            message: 'please confirm email',
          },
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      return null;
    },
  },
};
