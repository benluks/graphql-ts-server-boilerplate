import * as bcrypt from 'bcrypt';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { MutationRegisterArgs } from '../../types/schema';

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_: any, { email, password }: MutationRegisterArgs) => {
      const userAlreadyExists = await User.findOne({
        where: { email: email },
        select: ['id'],
      });
      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: 'already taken',
          },
        ];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email: email,
        password: hashedPassword,
      });

      await user.save();
      return null;
    },
  },
};
