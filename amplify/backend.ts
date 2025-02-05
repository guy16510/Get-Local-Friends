import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource';
import { userProfileFunction } from "./functions/userProfile/resource";
import { handler as contactFunction } from './functions/contact/handler';

defineBackend({
  data,
  // Casting the functions object as any so that custom keys (userProfile, contact) don’t cause TS errors.
  functions: {
    userProfile: userProfileFunction,
    contact: contactFunction,
  } as any,
  auth,
});