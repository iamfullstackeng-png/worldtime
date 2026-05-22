import { compose, composeFields, password, required } from '@/lib/validators';

// `email` accepts a username OR an email per the mockup ("Username or email"),
// so we only require presence — no format check. Password gets required first
// (left-to-right composition surfaces "required" on empty input, then
// `password()` rules on populated-but-invalid input). The user never sees both
// messages at once.
export const loginValidationSchema = composeFields({
  email: compose(required('Username or email is required')),
  password: compose(required('Password is required'), password()),
});
