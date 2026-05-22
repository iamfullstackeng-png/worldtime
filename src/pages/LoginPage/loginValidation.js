import { compose, composeFields, password, required } from '@/lib/validators';

export const loginValidationSchema = composeFields({
  email: compose(required('Username or email is required')),
  password: compose(required('Password is required'), password()),
});
