import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your Auth resource.
 *
 * This configuration sets up email‑based login. You can extend it with additional
 * settings such as password policies, MFA, or custom triggers if needed.
 *
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});