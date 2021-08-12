import * as yup from 'yup';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { GQL } from '../../types/schema';
import { createConfirmEmailLink } from '../../utils/createConfirmEmailLink';
import { formatYupError } from '../../utils/formatYupError';

const schema = yup.object().shape({
  email: yup.string().min(3).max(255).email(),
  password: yup.string().min(3).max(255),
});

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _: any,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url }
    ) => {
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
      const user = User.create({
        email,
        password,
      });

      await user.save();

      await createConfirmEmailLink(url, user.id, redis);

      return null;
    },
  },
};
