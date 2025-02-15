// amplify/backend/auth/<your-auth-resource>/overrides.ts
import { CfnUserPool, CfnUserPoolGroup } from 'aws-cdk-lib/aws-cognito';

export function override(resources: { userPool: CfnUserPool }): void {
  const userPool = resources.userPool;

  new CfnUserPoolGroup(userPool, 'AuthenticatedGroup', {
    userPoolId: userPool.ref, // Use userPool.ref to get the User Pool ID
    groupName: 'authenticated',
    description: 'Group for all authenticated users.',
    precedence: 1,
  });

  new CfnUserPoolGroup(userPool, 'PremiumGroup', {
    userPoolId: userPool.ref,
    groupName: 'premium',
    description: 'Group for users with premium content access.',
    precedence: 2,
  });
}