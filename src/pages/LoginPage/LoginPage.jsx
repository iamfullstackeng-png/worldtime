import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layout';
import { Button, Checkbox, Divider, SocialIconButton, TextField } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { useForm } from '@/hooks';
import { PATHS } from '@/routes/paths.js';

import LoginIllustration from './LoginIllustration.jsx';
import styles from './LoginPage.module.css';
import { loginValidationSchema } from './loginValidation.js';

const INITIAL_VALUES = { email: '', password: '', keepSignedIn: false };

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  const form = useForm({
    initialValues: INITIAL_VALUES,
    validate: loginValidationSchema,
  });

  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname ?? PATHS.HOME;
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleValidSubmit = (values) => {
    login({ email: values.email });
    const destination = location.state?.from?.pathname ?? PATHS.HOME;
    navigate(destination, { replace: true });
  };

  return (
    <AuthLayout illustration={<LoginIllustration />}>
      <div className={styles.formColumn}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>
          New user? 
          <a href="#" className={styles.createAccountLink}>
            Create an account
          </a>
        </p>

        <form className={styles.form} noValidate onSubmit={form.handleSubmit(handleValidSubmit)}>
          <TextField
            id="login-email"
            label="Username or email"
            hideLabel
            placeholder="Username or email"
            type="text"
            name="email"
            autoComplete="username"
            borderVariant="strong"
            value={form.values.email}
            onChange={form.handleChange('email')}
            onBlur={form.handleBlur('email')}
            error={form.errors.email}
            required
          />

          <TextField
            id="login-password"
            label="Password"
            hideLabel
            placeholder="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            borderVariant="strong"
            value={form.values.password}
            onChange={form.handleChange('password')}
            onBlur={form.handleBlur('password')}
            error={form.errors.password}
            required
          />

          {/* TODO: wire to persistence strategy if/when localStorage support is added. */}
          <Checkbox
            id="login-keep-signed-in"
            label="Keep me signed in"
            name="keepSignedIn"
            checked={form.values.keepSignedIn}
            onChange={form.handleChange('keepSignedIn')}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={form.isSubmitting}>
            Sign In
          </Button>
        </form>

        <Divider label="Or Sign In With" />

        <div className={styles.socialRow}>
          <SocialIconButton aria-label="Sign in with Google" href="#">
            G
          </SocialIconButton>
          <SocialIconButton aria-label="Sign in with Facebook" href="#">
            f
          </SocialIconButton>
          <SocialIconButton aria-label="Sign in with LinkedIn" href="#">
            in
          </SocialIconButton>
          <SocialIconButton aria-label="Sign in with Twitter" href="#">
            t
          </SocialIconButton>
        </div>
      </div>
    </AuthLayout>
  );
}
