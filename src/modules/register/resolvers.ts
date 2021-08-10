import * as bcrypt from 'bcrypt';
import * as yup from 'yup';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { MutationRegisterArgs } from '../../types/schema';
import { formatYupError } from '../../utils/formatYupError';

const schema = yup.object().shape({
  email: yup.string().min(3).max(255).email(),
  password: yup.string().min(3).max(255),
});

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_: any, args: MutationRegisterArgs) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;

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
