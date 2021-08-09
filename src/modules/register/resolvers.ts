import * as bcrypt from 'bcrypt';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { MutationRegisterArgs } from '../../types/schema';

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_: any, { email, password }: MutationRegisterArgs) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });

      await user.save();
      return true;
    },
  },
};
